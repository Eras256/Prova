// Tipos del adapter. Reflejamos estructuralmente la API pública de Solana Agent
// Kit v2 (BaseWallet, Action, SolanaAgentKit) para NO importar el paquete y
// mantener el adapter como peerDependency ligera. La compatibilidad se apoya en
// el tipado estructural de TypeScript.

/** Resultado típico del handler de una acción de SAK. */
export type ActionResult = Record<string, unknown>;

/** Acción de Solana Agent Kit (subconjunto que el adapter necesita). */
export interface HostAction {
  name: string;
  handler: (agent: unknown, input: Record<string, unknown>) => Promise<ActionResult>;
  [key: string]: unknown;
}

/** Agente de Solana Agent Kit (subconjunto que el adapter necesita). */
export interface HostAgent {
  actions: HostAction[];
  [key: string]: unknown;
}

/** BaseWallet de Solana Agent Kit v2, en forma estructural. */
export interface HostWallet {
  readonly publicKey: { toBase58(): string };
  signTransaction<T>(transaction: T): Promise<T>;
  signAllTransactions<T>(transactions: T[]): Promise<T[]>;
  signAndSendTransaction<T>(transaction: T, options?: unknown): Promise<{ signature: string }>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
}

/** Tipos de acción soportados por Prova (espejo de `ActionType` del SDK). */
export type ProvaActionType =
  | 'Transaction'
  | 'ToolCall'
  | 'ModelInvocation'
  | 'Decision'
  | 'ResourceAccess'
  | 'PolicyCheck'
  | 'Custom';

/** Una atestación lista para enviar (action_hash de 32 bytes + tipo). */
export interface AttestationItem {
  actionHash: Uint8Array;
  actionType: ProvaActionType;
  /** Si es true el hash queda on-chain pero el payload off-chain (Vanish). Default false. */
  privacyMode?: boolean;
}

/**
 * Superficie mínima que el adapter necesita de Prova, inyectada por el
 * integrador. Permite usar el `ProvaClient` real sin acoplarnos a su tipo.
 */
export interface ProvaAttester {
  hashAction(payload: string): Promise<Uint8Array>;
  attest(item: AttestationItem): Promise<{ txSignature: string }>;
  batchAttest(items: AttestationItem[]): Promise<{ txSignature: string }>;
}

/** Configuración del batching de atestaciones. */
export interface BatchOptions {
  /** Nº máximo de atestaciones por transacción (1–100). Al alcanzarlo, flush inmediato. Default 25. */
  maxSize?: number;
  /**
   * Debounce: hace flush este nº de ms tras la ÚLTIMA acción. Así una ráfaga de
   * tool calls (multi-tool-calling) se agrupa en UNA sola tx on-chain apenas
   * termina la ráfaga. Default 1000. 0 = flush inmediato en cada acción (sin batch).
   */
  flushDelayMs?: number;
}

/** Opciones de `attachProva`. */
export interface AttachProvaOptions {
  /** Puente hacia Prova (ver `attesterFromProvaClient`). */
  attester: ProvaAttester;
  /** Filtra qué acciones atestar por nombre (default: todas). */
  rules?: (actionName: string) => boolean;
  /** Configuración de batching. */
  batch?: BatchOptions;
  /** Manejo de errores (default: warn por consola). Nunca rompe la acción. */
  onError?: (error: unknown, context: { action: string }) => void;
}
