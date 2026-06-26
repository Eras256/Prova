// API pública del adapter Prova ↔ Solana Agent Kit.

export { attachProva } from './attach';
export type { ProvaHandle } from './attach';

export { ProvaWallet } from './wallet';
export type { ProvaWalletOptions } from './wallet';

export { attesterFromProvaClient } from './adapter';
export type { ProvaClientLike } from './adapter';

export { createBatcher } from './batcher';
export type { Batcher } from './batcher';

export { buildPayload, mapActionType, extractSignature } from './payload';

export type {
  HostAgent,
  HostAction,
  HostWallet,
  ProvaAttester,
  AttestationItem,
  ProvaActionType,
  AttachProvaOptions,
  BatchOptions,
} from './types';
