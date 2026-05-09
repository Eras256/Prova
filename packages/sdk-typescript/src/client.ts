import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  Ed25519Program,
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
  // 'Transaction' → { transaction: {} } (Anchor camelCase de enum)
  const key = t.charAt(0).toLowerCase() + t.slice(1);
  return { [key]: {} };
}

function explorerTxUrl(sig: string, network = 'devnet'): string {
  return `https://explorer.solana.com/tx/${sig}?cluster=${network}`;
}

/**
 * Cliente principal del SDK Prova.
 *
 * Permite registrar agentes de IA en Solana y emitir atestaciones de comportamiento
 * criptográficamente verificables con una API de 5 líneas.
 *
 * @example
 * ```typescript
 * import { ProvaClient } from '@prova/sdk';
 * import { Keypair } from '@solana/web3.js';
 *
 * const prova = new ProvaClient({
 *   rpcUrl: 'https://devnet.helius-rpc.com/?api-key=TU_KEY',
 *   agentKeypair: Keypair.fromSecretKey(agentSecretBytes),
 * });
 *
 * const hash = await ProvaClient.hashAction('swap 100 USDC → SOL en Jupiter');
 * const { txSignature } = await prova.attest({ operatorKeypair, actionHash: hash });
 * console.log(`Receipt: ${txSignature}`);
 * ```
 */
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

  /**
   * Deriva la PDA del AgentAccount para un operador dado.
   * PDA = findProgramAddress([b"prova_agent", operator_pubkey], programId)
   */
  deriveAgentPda(operator: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('prova_agent'), operator.toBuffer()],
      this.programId
    );
  }

  /**
   * Calcula sha-256 de una cadena de texto y devuelve 32 bytes.
   * Úsalo para producir el action_hash antes de llamar a attest().
   */
  static async hashAction(action: string): Promise<Uint8Array> {
    const bytes = new TextEncoder().encode(action);
    const buf = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buf).set(bytes);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return new Uint8Array(digest);
  }

  // ─── Instrucciones on-chain ─────────────────────────────────────────────────

  /**
   * Registra el agente en Solana.
   * - Crea el AgentAccount (PDA) con el agent_id = agentKeypair.publicKey
   * - El operador paga el rent y firma la tx
   * - Solo necesitas llamarlo una vez por operador
   */
  async registerAgent({
    operatorKeypair,
    policyRoot = new Uint8Array(32),
  }: RegisterAgentParams): Promise<RegisterAgentResult> {
    if (policyRoot.length !== 32) throw new Error('policyRoot must be exactly 32 bytes');

    const program = this.buildProgram(operatorKeypair);
    const agentId = Array.from(this.agentKeypair.publicKey.toBytes());
    const policy = Array.from(policyRoot);

    const methods = program.methods as unknown as Record<
      string,
      (...args: unknown[]) => {
        accounts: (a: Record<string, unknown>) => { rpc: (opts?: unknown) => Promise<string> };
      }
    >;

    const [agentPda] = this.deriveAgentPda(operatorKeypair.publicKey);

    const txSignature = await methods
      .registerAgent!(agentId, policy)
      .accounts({
        operator: operatorKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc({ commitment: 'confirmed' });

    return {
      txSignature,
      agentPda,
      explorerUrl: explorerTxUrl(txSignature, this.network),
    };
  }

  /**
   * Emite una atestación de comportamiento.
   *
   * 1. El agente firma el action_hash con su keypair (Ed25519, off-chain)
   * 2. Se añade una instrucción Ed25519 pre-verify (verificada nativamente por Solana)
   * 3. Se añade record_attestations — el programa valida la firma y emite AttestationIssued
   * 4. El operador firma y paga la tx completa
   */
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

  /**
   * Emite múltiples atestaciones en una sola transacción (máximo 100).
   * Más eficiente que llamar attest() varias veces.
   */
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

  /**
   * Revoca el agente. Después de revocar, record_attestations falla con AgentRevoked.
   * La revocación es irreversible con el mismo operador.
   */
  async revokeAgent({ operatorKeypair }: RevokeAgentParams): Promise<AttestResult> {
    const program = this.buildProgram(operatorKeypair);
    const [agentPda] = this.deriveAgentPda(operatorKeypair.publicKey);

    const methods = program.methods as unknown as Record<
      string,
      () => {
        accounts: (a: Record<string, unknown>) => { rpc: (opts?: unknown) => Promise<string> };
      }
    >;

    const txSignature = await methods
      .revokeAgent!()
      .accounts({ agent: agentPda, operator: operatorKeypair.publicKey })
      .rpc({ commitment: 'confirmed' });

    return { txSignature, explorerUrl: explorerTxUrl(txSignature, this.network) };
  }

  /**
   * Actualiza la raíz de política (Merkle root) del agente.
   * Permite actualizar el árbol de políticas sin volver a registrar.
   */
  async updatePolicyRoot({
    operatorKeypair,
    newRoot,
  }: UpdatePolicyRootParams): Promise<AttestResult> {
    if (newRoot.length !== 32) throw new Error('newRoot must be exactly 32 bytes');

    const program = this.buildProgram(operatorKeypair);
    const [agentPda] = this.deriveAgentPda(operatorKeypair.publicKey);

    const methods = program.methods as unknown as Record<
      string,
      (root: number[]) => {
        accounts: (a: Record<string, unknown>) => { rpc: (opts?: unknown) => Promise<string> };
      }
    >;

    const txSignature = await methods
      .updatePolicyRoot!(Array.from(newRoot))
      .accounts({ agent: agentPda, operator: operatorKeypair.publicKey })
      .rpc({ commitment: 'confirmed' });

    return { txSignature, explorerUrl: explorerTxUrl(txSignature, this.network) };
  }

  // ─── Lectura on-chain ────────────────────────────────────────────────────────

  /**
   * Lee el AgentAccount on-chain para un operador dado.
   * Lanza AgentNotFoundError si el agente no está registrado.
   */
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
   * Verifica si el agente está registrado y activo.
   * Útil antes de emitir atestaciones para evitar txs fallidas.
   */
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
    // Resuelve si se pasó el operador
    let agentPda = agentPdaOrOperator;
    try {
      const account = await this.getAgentAccount(agentPdaOrOperator);
      agentPda = account.address;
    } catch {
      // Asumir que ya es una PDA directa
    }

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

    // Por cada atestación: firmar action_hash con el agente + Ed25519 pre-verify ix
    const ed25519Ixs = entries.map((entry) => {
      const sig = nacl.sign.detached(entry.actionHash, this.agentKeypair.secretKey);
      return Ed25519Program.createInstructionWithPublicKey({
        publicKey: this.agentKeypair.publicKey.toBytes(),
        message: entry.actionHash,
        signature: sig,
      });
    });

    // Preparar AttestationInput[] para la instrucción
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

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    const tx = new Transaction({ feePayer: operatorKeypair.publicKey, blockhash, lastValidBlockHeight });

    // Ed25519 pre-verify ix en posiciones 0..N-1, record_attestations en posición N
    for (const ix of ed25519Ixs) tx.add(ix);
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
