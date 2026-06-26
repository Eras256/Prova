// Buffer de atestaciones: acumula items y los envía en lote (batchAttest) cada
// N items o cada T ms, lo que ocurra primero. Aísla la latencia/coste de Solana
// del hot-path del agente.

import type { AttestationItem, BatchOptions, ProvaAttester } from './types';
import { clearIntervalSafe, setIntervalSafe, warn, type TimerId } from './runtime';

export interface Batcher {
  /** Encola una atestación; dispara flush si se alcanza maxSize. */
  add(item: AttestationItem): void;
  /** Envía inmediatamente lo pendiente. */
  flush(): Promise<void>;
  /** Detiene el timer y hace un último flush. */
  stop(): Promise<void>;
}

const DEFAULT_MAX_SIZE = 25;
const DEFAULT_INTERVAL_MS = 10_000;
const HARD_BATCH_LIMIT = 100;

export function createBatcher(
  attester: ProvaAttester,
  options: BatchOptions = {},
  onError: (error: unknown) => void = (error) => warn('[Prova] batch error:', error),
): Batcher {
  const maxSize = Math.min(Math.max(options.maxSize ?? DEFAULT_MAX_SIZE, 1), HARD_BATCH_LIMIT);
  const intervalMs = options.flushIntervalMs ?? DEFAULT_INTERVAL_MS;

  let buffer: AttestationItem[] = [];
  let timer: TimerId | undefined;

  async function flush(): Promise<void> {
    if (buffer.length === 0) return;
    const batch = buffer;
    buffer = [];
    try {
      if (batch.length === 1) {
        await attester.attest(batch[0]!);
      } else {
        await attester.batchAttest(batch);
      }
    } catch (error) {
      onError(error);
    }
  }

  function ensureTimer(): void {
    if (intervalMs > 0 && timer === undefined) {
      timer = setIntervalSafe(() => void flush(), intervalMs);
    }
  }

  return {
    add(item: AttestationItem): void {
      buffer.push(item);
      ensureTimer();
      if (buffer.length >= maxSize) void flush();
    },
    flush,
    async stop(): Promise<void> {
      if (timer !== undefined) {
        clearIntervalSafe(timer);
        timer = undefined;
      }
      await flush();
    },
  };
}
