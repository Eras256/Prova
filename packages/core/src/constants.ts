// Programa desplegado en Solana devnet
export const PROVA_PROGRAM_ID = 'G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1';

export const SCHEMA_VERSION = 1;
export const PROVA_SCHEMA_VERSION = 1;

export const ACTION_TYPES = {
  TRANSACTION:      'Transaction',
  DECISION:         'Decision',
  MODEL_INVOCATION: 'ModelInvocation',
  TOOL_CALL:        'ToolCall',
  RESOURCE_ACCESS:  'ResourceAccess',
  POLICY_CHECK:     'PolicyCheck',
  CUSTOM:           'Custom',
} as const;

// PDA del agente: [b"prova_agent", operator_pubkey]
export const AGENT_SEED = Buffer.from('prova_agent');

// Las atestaciones son eventos (emit!) — no cuentas on-chain
export const MAX_BATCH_ATTESTATIONS = 100;
