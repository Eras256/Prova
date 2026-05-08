import { z } from 'zod';

export const ActionTypeSchema = z.enum([
  'Transaction',
  'Decision',
  'ModelInvocation',
  'ToolCall',
  'ResourceAccess',
  'PolicyCheck',
  'Custom',
]);

export const AgentSchema = z.object({
  pda: z.string(),
  operator: z.string(),
  agentId: z.string(),
  policyRoot: z.string(),
  registeredAt: z.number(),
  revoked: z.boolean(),
  attestationCount: z.number(),
});

export const AttestationSchema = z.object({
  pda: z.string(),
  agentPda: z.string(),
  actionType: ActionTypeSchema,
  actionHash: z.string(),
  timestamp: z.number(),
  blockHeight: z.number(),
  privacyMode: z.boolean(),
  metadataUri: z.string().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  signature: z.string(),
  schemaVersion: z.number(),
});

export const ProvaConfigSchema = z.object({
  rpcUrl: z.string().url(),
  privacyMode: z.boolean().default(false),
  schemaVersion: z.number().default(1),
});
