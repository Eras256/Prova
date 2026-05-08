export const PROVA_PROGRAM_ID = 'ProvaATTESTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

export const PROVA_SCHEMA_VERSION = 1;

export const ACTION_TYPES = {
  TRANSACTION: 'Transaction',
  DECISION: 'Decision',
  MODEL_INVOCATION: 'ModelInvocation',
  TOOL_CALL: 'ToolCall',
  RESOURCE_ACCESS: 'ResourceAccess',
  POLICY_CHECK: 'PolicyCheck',
  CUSTOM: 'Custom',
} as const;

export const REGISTRY_SEED = Buffer.from('prova_registry');
export const AGENT_SEED = Buffer.from('prova_agent');
export const ATTESTATION_SEED = Buffer.from('prova_attestation');

export const MAX_BATCH_ATTESTATIONS = 10;
export const MAX_METADATA_URI_LENGTH = 200;
export const SCHEMA_VERSION = 1;
