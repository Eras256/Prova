// Cliente principal (on-chain)
export { ProvaClient } from './client';

// Cliente REST API (off-chain queries)
export { ProvaApiClient } from './api-client';
export type {
  ProvaApiClientConfig,
  ListAttestationsQuery,
  AttestationResponse,
  AgentResponse,
  AgentStatsResponse,
  BulkVerifyItem,
  Pagination,
} from './api-client';

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
} from './core';

// Errores re-exportados
export {
  ProvaError,
  AgentNotFoundError,
  AgentRevokedError,
  AttestationNotFoundError,
  InvalidSignatureError,
  BatchLimitExceededError,
  UnauthorizedError,
} from './core';
