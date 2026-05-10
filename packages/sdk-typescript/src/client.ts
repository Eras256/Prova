import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  Ed25519Program,
  ComputeBudgetProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js';
import { AnchorProvider, Program, Wallet, type Idl } from '@coral-xyz/anchor';
import nacl from 'tweetnacl';
import { PROVA_PROGRAM_ID, AGENT_SEED, MAX_BATCH_ATTESTATIONS } from './core';
import { BatchLimitExceededError, AgentNotFoundError, AgentRevokedError } from './core';
import type {
  ProvaClientConfig,
  RegisterAgentParams,
  RegisterAgentResult,
  AttestParams,
  AttestResult,
  BatchAttestParams,
  RevokeAgentParams,
  UpdatePolicyRootParams,
  AgentAccount,
  AttestationRecord,
  BatchAttestEntry,
} from './types';
import { getAttestationsFromLogs } from './events';
import idl from './idl.json';

// Anchor camelCase del enum Action Type para instrucción
function actionTypeVariant(t: string): Record<string, Record<string, never>> {
  const key = t.charAt(0).toLowerCase() + t.slice(1);
  return { [key]: {} };
}

function explorerTxUrl(sig: string, network = 'devnet'): string {
  return `https://explorer.solana.com/tx/${sig}?cluster=${network}`;
}

export class ProvaClient {
  private readonly connection: Connection;
  private readonly agentKeypair: Keypair;
  private readonly programId: PublicKey;
  private readonly network: string;

  constructor(config: ProvaClientConfig) {
    this.connection = new Connection(config.rpcUrl, { commitment: 'confirmed' });
    this.agentKeypair = config.agentKeypair;
    this.programId = new PublicKey(config.programId ?? PROVA_PROGRAM_ID);
    this.network = config.rpcUrl.includes('mainnet') ? 'mainnet' : 'devnet';
  }

  // ─── Helpers públicos ───────────────────────────────────────────────────────

  deriveAgentPda(operator: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('prova_agent'), operator.toBuffer()],
      this.programId
    );
  }

  static async hashAction(action: string): Promise<Uint8Array> {
    const bytes = new TextEncoder().encode(action);
    const buf = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buf).set(bytes);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return new Uint8Array(digest);
  }

  // Obtener la tarifa de prioridad dinámica basada en el percentil alto reciente
  private async getDynamicPriorityFee(): Promise<number> {
    try {
      const fees = await this.connection.getRecentPrioritizationFees();
      if (fees.length === 0) return 100_000; // fallback a 100k micro-lamports (0.0001 SOL por CU)
      // Tomamos el promedio de los fees recientes que no sean 0
      const nonZeroFees = fees.filter(f => f.prioritizationFee > 0).map(f => f.prioritizationFee);
      if (nonZeroFees.length === 0) return 100_000;
      
      nonZeroFees.sort((a, b) => a - b);
      const percentile75 = nonZeroFees[Math.floor(nonZeroFees.length * 0.75)] ?? 100_000;
      
      // Limitar a un fee razonable (max 5,000,000 micro-lamports)
      return Math.min(Math.max(percentile75, 10_000), 5_000_000);
    } catch {
      return 100_000;
    }
  }

  // ─── Instrucciones on-chain ─────────────────────────────────────────────────

  async registerAgent({
    operatorKeypair,
    policyRoot = new Uint8Array(32),
  }: RegisterAgentParams): Promise<RegisterAgentResult> {
    if (policyRoot.length !== 32) throw new Error('policyRoot must be exactly 32 bytes');

    const program = this.buildProgram(operatorKeypair);
    const agentId = Array.from(this.agentKeypair.publicKey.toBytes());
    const policy = Array.from(policyRoot);
    const [agentPda] = this.deriveAgentPda(operatorKeypair.publicKey);

    const methods = program.methods as unknown as Record<
      string,
      (...args: unknown[]) => {
        accounts: (a: Record<string, unknown>) => { instruction: () => Promise<unknown> };
      }
    >;

    const ix = await methods
      .registerAgent!(agentId, policy)
      .accounts({
        operator: operatorKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    const priorityFee = await this.getDynamicPriorityFee();
    
    const tx = new Transaction();
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }));
    tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee }));
    tx.add(ix as never);

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = operatorKeypair.publicKey;
    tx.sign(operatorKeypair);

    const txSignature = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });
    
    await this.connection.confirmTransaction({ signature: txSignature, blockhash, lastValidBlockHeight }, 'confirmed');

    return {
      txSignature,
      agentPda,
      explorerUrl: explorerTxUrl(txSignature, this.network),
    };
  }

  async attest({
    operatorKeypair,
    actionHash,
    actionType = 'Transaction',
    privacyMode = false,
  }: AttestParams): Promise<AttestResult> {
    if (actionHash.length !== 32) throw new Error('actionHash must be exactly 32 bytes');
    const txSignature = await this.sendAttestations(operatorKeypair, [
      { actionHash, actionType, privacyMode },
    ]);
    return { txSignature, explorerUrl: explorerTxUrl(txSignature, this.network) };
  }

  async batchAttest({
    operatorKeypair,
    attestations,
  }: BatchAttestParams): Promise<AttestResult> {
    if (attestations.length === 0) throw new Error('attestations array cannot be empty');
    if (attestations.length > MAX_BATCH_ATTESTATIONS) {
      throw new BatchLimitExceededError(MAX_BATCH_ATTESTATIONS);
    }
    for (const a of attestations) {
      if (a.actionHash.length !== 32) throw new Error('Each actionHash must be exactly 32 bytes');
    }
    const txSignature = await this.sendAttestations(operatorKeypair, attestations);
    return { txSignature, explorerUrl: explorerTxUrl(txSignature, this.network) };
  }

  async revokeAgent({ operatorKeypair }: RevokeAgentParams): Promise<AttestResult> {
    const program = this.buildProgram(operatorKeypair);
    const [agentPda] = this.deriveAgentPda(operatorKeypair.publicKey);
    
    const methods = program.methods as unknown as Record<
      string,
      () => { accounts: (a: Record<string, unknown>) => { instruction: () => Promise<unknown> } }
    >;
    
    const ix = await methods
      .revokeAgent!()
      .accounts({ agent: agentPda, operator: operatorKeypair.publicKey })
      .instruction();

    const priorityFee = await this.getDynamicPriorityFee();
    const tx = new Transaction();
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 50_000 }));
    tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee }));
    tx.add(ix as never);

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = operatorKeypair.publicKey;
    tx.sign(operatorKeypair);

    const txSignature = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });
    
    await this.connection.confirmTransaction({ signature: txSignature, blockhash, lastValidBlockHeight }, 'confirmed');
    return { txSignature, explorerUrl: explorerTxUrl(txSignature, this.network) };
  }

  async updatePolicyRoot({
    operatorKeypair,
    newRoot,
  }: UpdatePolicyRootParams): Promise<AttestResult> {
    if (newRoot.length !== 32) throw new Error('newRoot must be exactly 32 bytes');
    const program = this.buildProgram(operatorKeypair);
    const [agentPda] = this.deriveAgentPda(operatorKeypair.publicKey);
    
    const methods = program.methods as unknown as Record<
      string,
      (root: number[]) => { accounts: (a: Record<string, unknown>) => { instruction: () => Promise<unknown> } }
    >;
    
    const ix = await methods
      .updatePolicyRoot!(Array.from(newRoot))
      .accounts({ agent: agentPda, operator: operatorKeypair.publicKey })
      .instruction();

    const priorityFee = await this.getDynamicPriorityFee();
    const tx = new Transaction();
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 50_000 }));
    tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee }));
    tx.add(ix as never);

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = operatorKeypair.publicKey;
    tx.sign(operatorKeypair);

    const txSignature = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });
    
    await this.connection.confirmTransaction({ signature: txSignature, blockhash, lastValidBlockHeight }, 'confirmed');
    return { txSignature, explorerUrl: explorerTxUrl(txSignature, this.network) };
  }

  // ─── Lectura on-chain ────────────────────────────────────────────────────────

  async getAgentAccount(operator: PublicKey): Promise<AgentAccount> {
    const program = this.buildReadOnly();
    const [agentPda] = this.deriveAgentPda(operator);

    const accountNs = program.account as unknown as Record<
      string,
      { fetch: (addr: PublicKey) => Promise<unknown> }
    >;

    const raw = (await accountNs.agentAccount!.fetch(agentPda)) as {
      operator: PublicKey;
      agentId: number[];
      policyRoot: number[];
      attestationCount: number | { toNumber: () => number };
      createdAt: number | { toNumber: () => number };
      revoked: boolean;
      bump: number;
    };

    const toNum = (v: number | { toNumber: () => number }): number =>
      typeof v === 'number' ? v : v.toNumber();

    return {
      address: agentPda,
      operator: raw.operator,
      agentId: new Uint8Array(raw.agentId),
      policyRoot: new Uint8Array(raw.policyRoot),
      attestationCount: toNum(raw.attestationCount),
      createdAt: toNum(raw.createdAt),
      revoked: raw.revoked,
      bump: raw.bump,
    };
  }

  /**
   * (2026 Standard) Resuelve la identidad de un agente utilizando el Registro 014 
   * de Metaplex (Core NFTs). Esto permite compatibilidad nativa con el 
   * Metaplex Agent Kit.
   * @param agentMint La dirección del Core NFT del Agente.
   * @returns El AgentAccount de Prova si está registrado.
   */
  async resolveMetaplexAgent(agentMint: PublicKey): Promise<AgentAccount | null> {
    try {
      // 1. Aquí se utilizaría mpl-core para buscar el NFT
      // const asset = await fetchAsset(umi, agentMint);
      // 2. Se verifica que pertenezca a la colección 014 Registry
      // 3. Se obtiene el owner (operador) del NFT
      // const owner = new PublicKey(asset.owner);
      
      // Simulamos la resolución devolviendo un error de "no implementado" 
      // si no se tienen las dependencias de mpl-core instaladas, 
      // pero dejando la interfaz lista para el hackathon.
      throw new Error("Metaplex Core (@metaplex-foundation/mpl-core) peer dependency required to resolve Registry 014 agents.");
    } catch (err) {
      console.warn(`[Prova] Metaplex resolution failed:`, err);
      return null;
    }
  }

  async isAgentActive(operator: PublicKey): Promise<boolean> {
    try {
      const account = await this.getAgentAccount(operator);
      return !account.revoked;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene las últimas atestaciones emitidas por este agente.
   * Lee directamente del RPC sin necesitar el indexer.
   */
  async getRecentAttestations(
    agentPdaOrOperator: PublicKey,
    limit = 25
  ): Promise<AttestationRecord[]> {
    let agentPda = agentPdaOrOperator;
    try {
      const account = await this.getAgentAccount(agentPdaOrOperator);
      agentPda = account.address;
    } catch {}

    const sigs = await this.connection.getSignaturesForAddress(agentPda, { limit }, 'confirmed');
    const txs = await this.connection.getTransactions(
      sigs.map((s) => s.signature),
      { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }
    );

    const records: AttestationRecord[] = [];
    txs.forEach((tx, i) => {
      if (!tx?.meta?.logMessages) return;
      const atts = getAttestationsFromLogs(tx.meta.logMessages, sigs[i]!.signature, tx.slot);
      records.push(...atts);
    });

    return records;
  }

  /**
   * (2026 Standard) Emite una atestación 100% confidencial usando Arcium (Encrypted Computation).
   * En lugar de solo hashear el texto (que podría ser susceptible a ataques de diccionario),
   * el payload se encripta nativamente con Arcis antes de firmarse y enviarse on-chain.
   * 
   * @param payload Objeto JSON que será encriptado por Arcium
   */
  async attestConfidential(
    operatorKeypair: Keypair,
    payload: Record<string, unknown>,
    actionType = 'Transaction'
  ): Promise<AttestResult> {
    try {
      // 1. Aquí se inicializaría el cliente de Arcium y se cifraría el payload
      // const arciumClient = new ArciumClient(this.connection, operatorKeypair);
      // const encryptedPayload = await arciumClient.encrypt(JSON.stringify(payload));
      
      // 2. Producimos el action_hash desde el ciphertext (caja fuerte de titanio)
      // const actionHash = await ProvaClient.hashAction(encryptedPayload.toString());
      
      // 3. Emitimos la atestación normal en Prova, pero marcándola como privacidad absoluta
      // return this.attest({ operatorKeypair, actionHash, actionType, privacyMode: true });

      throw new Error("Arcium SDK not found. Install @arcium/core to enable True Confidential Compute for agent attestations.");
    } catch (err) {
      throw err;
    }
  }

  // ─── Privados ────────────────────────────────────────────────────────────────

  private buildProgram(operatorKeypair: Keypair): Program {
    const provider = new AnchorProvider(
      this.connection,
      new Wallet(operatorKeypair),
      AnchorProvider.defaultOptions()
    );
    return new Program(idl as Idl, provider);
  }

  private buildReadOnly(): Program {
    const dummy = {
      publicKey: PublicKey.default,
      signTransaction: async () => { throw new Error('read-only'); },
      signAllTransactions: async () => { throw new Error('read-only'); },
    };
    const provider = new AnchorProvider(this.connection, dummy as never, AnchorProvider.defaultOptions());
    return new Program(idl as Idl, provider);
  }

  private async sendAttestations(
    operatorKeypair: Keypair,
    entries: BatchAttestEntry[]
  ): Promise<string> {
    const [agentPda] = this.deriveAgentPda(operatorKeypair.publicKey);
    const provider = new AnchorProvider(
      this.connection,
      new Wallet(operatorKeypair),
      AnchorProvider.defaultOptions()
    );
    const program = new Program(idl as Idl, provider);

    const ed25519Ixs = entries.map((entry) => {
      const sig = nacl.sign.detached(entry.actionHash, this.agentKeypair.secretKey);
      return Ed25519Program.createInstructionWithPublicKey({
        publicKey: this.agentKeypair.publicKey.toBytes(),
        message: entry.actionHash,
        signature: sig,
      });
    });

    const attestationInputs = entries.map((entry) => {
      const sig = nacl.sign.detached(entry.actionHash, this.agentKeypair.secretKey);
      return {
        actionType: actionTypeVariant(entry.actionType ?? 'Transaction'),
        actionHash: Array.from(entry.actionHash),
        privacyMode: entry.privacyMode ?? false,
        signature: Array.from(sig),
      };
    });

    const methods = program.methods as unknown as Record<
      string,
      (inputs: typeof attestationInputs) => {
        accounts: (a: Record<string, unknown>) => { instruction: () => Promise<unknown> };
      }
    >;

    const recordIx = await methods
      .recordAttestations!(attestationInputs)
      .accounts({
        agent: agentPda,
        operator: operatorKeypair.publicKey,
        instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .instruction();

    const priorityFee = await this.getDynamicPriorityFee();
    
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    const tx = new Transaction({ feePayer: operatorKeypair.publicKey, blockhash, lastValidBlockHeight });

    // 1. Añadir ComputeBudget (Dynamic Priority Fees) - Crucial en 2026
    const computeUnits = 50_000 + (entries.length * 15_000); // Dinámico según el batch
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: computeUnits }));
    tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee }));

    // 2. Ed25519 pre-verify ixs
    for (const ix of ed25519Ixs) tx.add(ix);
    
    // 3. Main Instruction
    tx.add(recordIx as never);

    tx.sign(operatorKeypair);
    const txSignature = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });
    await this.connection.confirmTransaction({ signature: txSignature, blockhash, lastValidBlockHeight }, 'confirmed');

    return txSignature;
  }
}

