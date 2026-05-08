import type { Keypair, PublicKey } from '@solana/web3.js';
import type { ActionType, AttestationPayload, AttestationResult, HistoryQuery, VerifyResult } from '@prova/core';

export interface ProvaClientConfig {
  rpcUrl: string;
  agentKeypair: Keypair;
  privacyMode?: boolean;
  schemaVersion?: number;
}

export interface IProvaClient {
  attest(payload: AttestationPayload): Promise<AttestationResult>;
  verify(attestationId: string): Promise<VerifyResult>;
  history(query: HistoryQuery): Promise<AttestationResult[]>;
  revoke(): Promise<void>;
  getAgentPda(): PublicKey;
}

export type { ActionType, AttestationPayload, AttestationResult, HistoryQuery, VerifyResult };
