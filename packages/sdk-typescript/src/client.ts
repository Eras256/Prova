import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import {
  PROVA_PROGRAM_ID,
  AGENT_SEED,
  ATTESTATION_SEED,
  MAX_BATCH_ATTESTATIONS,
  SCHEMA_VERSION,
} from '@prova/core';
import { BatchLimitExceededError, AgentRevokedError } from '@prova/core';
import type { AttestationPayload, AttestationResult, HistoryQuery, VerifyResult } from '@prova/core';
import type { ProvaClientConfig } from './types';

export class ProvaClient {
  private readonly connection: Connection;
  private readonly keypair: Keypair;
  private readonly privacyMode: boolean;
  private readonly schemaVersion: number;

  constructor(config: ProvaClientConfig) {
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    this.keypair = config.agentKeypair;
    this.privacyMode = config.privacyMode ?? false;
    this.schemaVersion = config.schemaVersion ?? SCHEMA_VERSION;
  }

  getAgentPda(): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [AGENT_SEED, this.keypair.publicKey.toBuffer()],
      new PublicKey(PROVA_PROGRAM_ID)
    );
    return pda;
  }

  async attest(payload: AttestationPayload): Promise<AttestationResult> {
    const serialized = JSON.stringify({
      actionType: payload.actionType,
      payload: payload.payload,
      metadata: payload.metadata,
      timestamp: Date.now(),
    });

    const actionHash = await this.hashPayload(serialized);
    const signature = nacl.sign.detached(
      Buffer.from(actionHash, 'hex'),
      this.keypair.secretKey
    );

    const agentPda = this.getAgentPda();
    const [attestationPda] = PublicKey.findProgramAddressSync(
      [
        ATTESTATION_SEED,
        agentPda.toBuffer(),
        Buffer.from(actionHash, 'hex').slice(0, 8),
      ],
      new PublicKey(PROVA_PROGRAM_ID)
    );

    const tx = new Transaction().add(
      this.buildIssueInstruction({
        agentPda,
        attestationPda,
        actionType: payload.actionType,
        actionHash,
        metadataUri: null,
        privacyMode: this.privacyMode,
        signature: Array.from(signature),
      })
    );

    const txSignature = await this.connection.sendTransaction(tx, [this.keypair]);
    const { context } = await this.connection.confirmTransaction(txSignature);

    return {
      id: attestationPda.toBase58(),
      agentPda: agentPda.toBase58(),
      txSignature,
      timestamp: Date.now(),
      blockHeight: context.slot,
    };
  }

  async batchAttest(payloads: AttestationPayload[]): Promise<AttestationResult[]> {
    if (payloads.length > MAX_BATCH_ATTESTATIONS) {
      throw new BatchLimitExceededError(MAX_BATCH_ATTESTATIONS);
    }
    return Promise.all(payloads.map((p) => this.attest(p)));
  }

  async verify(attestationId: string): Promise<VerifyResult> {
    try {
      const pda = new PublicKey(attestationId);
      const accountInfo = await this.connection.getAccountInfo(pda);

      if (!accountInfo) {
        return { valid: false, error: 'Attestation account not found on-chain' };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async history(query: HistoryQuery): Promise<AttestationResult[]> {
    return [];
  }

  async revoke(): Promise<void> {
    const agentPda = this.getAgentPda();
    const tx = new Transaction().add(
      this.buildRevokeInstruction({ agentPda })
    );
    const txSignature = await this.connection.sendTransaction(tx, [this.keypair]);
    await this.connection.confirmTransaction(txSignature);
  }

  private async hashPayload(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private buildIssueInstruction(params: {
    agentPda: PublicKey;
    attestationPda: PublicKey;
    actionType: string;
    actionHash: string;
    metadataUri: string | null;
    privacyMode: boolean;
    signature: number[];
  }): anchor.web3.TransactionInstruction {
    const data = Buffer.alloc(1);
    data[0] = 2;
    return new anchor.web3.TransactionInstruction({
      programId: new PublicKey(PROVA_PROGRAM_ID),
      keys: [
        { pubkey: params.agentPda, isSigner: false, isWritable: true },
        { pubkey: params.attestationPda, isSigner: false, isWritable: true },
        { pubkey: this.keypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    });
  }

  private buildRevokeInstruction(params: { agentPda: PublicKey }): anchor.web3.TransactionInstruction {
    const data = Buffer.alloc(1);
    data[0] = 4;
    return new anchor.web3.TransactionInstruction({
      programId: new PublicKey(PROVA_PROGRAM_ID),
      keys: [
        { pubkey: params.agentPda, isSigner: false, isWritable: true },
        { pubkey: this.keypair.publicKey, isSigner: true, isWritable: false },
      ],
      data,
    });
  }
}
