import type { z } from 'zod';
import type {
  AttestationSchema,
  AgentSchema,
  ActionTypeSchema,
  ProvaConfigSchema,
} from './schemas';

export type ActionType = z.infer<typeof ActionTypeSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type Attestation = z.infer<typeof AttestationSchema>;
export type ProvaConfig = z.infer<typeof ProvaConfigSchema>;

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
