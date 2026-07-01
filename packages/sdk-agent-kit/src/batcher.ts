// Buffer de atestaciones con flush por DEBOUNCE: agrupa una ráfaga de acciones
// (multi-tool-calling) y las envía en UNA sola tx (batchAttest, hasta 100) apenas
// la ráfaga se detiene. Esto arregla el bug de "N tool calls seguidos → 0 guardadas":
// antes el flush solo ocurría a los 25 items o cada 10s, así que una ráfaga corta
// que terminaba antes quedaba sin enviar.

import type { AttestationItem, BatchOptions, ProvaAttester } from './types';
import { clearTimeoutSafe, setTimeoutSafe, warn, type TimerId } from './runtime';

export interface Batcher {
  /** Encola una atestación; programa el flush (o lo dispara si se alcanza maxSize). */
  add(item: AttestationItem): void;
  /** Envía inmediatamente lo pendiente. */
  flush(): Promise<void>;
  /** Cancela el timer y hace un último flush (llamar al cerrar el agente). */
  stop(): Promise<void>;
}

const DEFAULT_MAX_SIZE = 25;
const DEFAULT_FLUSH_DELAY_MS = 1000;
const HARD_BATCH_LIMIT = 100;

export function createBatcher(
  attester: ProvaAttester,
  options: BatchOptions = {},
  onError: (error: unknown) => void = (error) => warn('[Prova] batch error:', error),
): Batcher {
  const maxSize = Math.min(Math.max(options.maxSize ?? DEFAULT_MAX_SIZE, 1), HARD_BATCH_LIMIT);
  const flushDelayMs = options.flushDelayMs ?? DEFAULT_FLUSH_DELAY_MS;

  let buffer: AttestationItem[] = [];
  let timer: TimerId | undefined;

  function clearTimer(): void {
    if (timer !== undefined) {
      clearTimeoutSafe(timer);
      timer = undefined;
    }
  }

  async function flush(): Promise<void> {
    clearTimer();
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

  // Debounce: cada acción reinicia el timer, de modo que el flush ocurre
  // `flushDelayMs` ms DESPUÉS de la última acción de la ráfaga → todo en 1 tx.
  function scheduleFlush(): void {
    clearTimer();
    if (flushDelayMs <= 0) {
      void flush();
      return;
    }
    timer = setTimeoutSafe(() => void flush(), flushDelayMs);
  }

  return {
    add(item: AttestationItem): void {
      buffer.push(item);
      if (buffer.length >= maxSize) {
        void flush(); // llegó al tope → envía ya
      } else {
        scheduleFlush(); // si no, agrupa la ráfaga y envía al detenerse
      }
    },
    flush,
    async stop(): Promise<void> {
      clearTimer();
      await flush();
    },
  };
}
