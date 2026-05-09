import type { ACTION_TYPE_VALUES } from './schemas';

export type ActionType = typeof ACTION_TYPE_VALUES[number];

export interface Agent {
  pda: string;
  operator: string;
  agentId: string;
  policyRoot: string;
  registeredAt: number;
  revoked: boolean;
  attestationCount: number;
}

export interface Attestation {
  pda: string;
  agentPda: string;
  actionType: ActionType;
  actionHash: string;
  timestamp: number;
  blockHeight: number;
  privacyMode: boolean;
  metadataUri: string | null;
  metadata: Record<string, unknown> | null;
  signature: string;
  schemaVersion: number;
}

export interface ProvaConfig {
  rpcUrl: string;
  privacyMode?: boolean;
  schemaVersion?: number;
}

export interface AttestationPayload {
  actionType: ActionType;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AttestationResult {
  id: string;
  agentPda: string;
  txSignature: string;
  timestamp: number;
  blockHeight: number;
}

export interface VerifyResult {
  valid: boolean;
  attestation?: Attestation;
  error?: string;
}

export interface HistoryQuery {
  agentId: string;
  fromTimestamp?: number;
  toTimestamp?: number;
  actionType?: ActionType;
  limit?: number;
  offset?: number;
}
