// Cliente principal
export { ProvaClient } from './client';

// Builder de payloads
export { AttestationBuilder } from './attestation-builder';

// Decodificador de eventos
export { decodeEventsFromLogs, getAttestationsFromLogs } from './events';

// Tipos públicos
export type {
  ProvaClientConfig,
  RegisterAgentParams,
  RegisterAgentResult,
  AttestParams,
  AttestResult,
  BatchAttestParams,
  BatchAttestEntry,
  RevokeAgentParams,
  UpdatePolicyRootParams,
  AgentAccount,
  AttestationRecord,
  ActionType,
} from './types';

// Constantes re-exportadas de @prova/core
export {
  PROVA_PROGRAM_ID,
  ACTION_TYPES,
  SCHEMA_VERSION,
  MAX_BATCH_ATTESTATIONS,
} from '@prova/core';

// Errores re-exportados
export {
  ProvaError,
  AgentNotFoundError,
  AgentRevokedError,
  AttestationNotFoundError,
  InvalidSignatureError,
  BatchLimitExceededError,
  UnauthorizedError,
} from '@prova/core';
