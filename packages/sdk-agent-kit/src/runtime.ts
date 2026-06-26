// Acceso tipado a globales de runtime (timers, console) sin depender de
// @types/node ni de los tipos del DOM. En ejecución real los provee Node o el
// navegador; aquí los declaramos mínimamente para mantener el adapter ligero.

/** Identificador opaco de un timer (number en navegador, objeto en Node). */
export type TimerId = number | { readonly __timer?: unique symbol };

interface RuntimeGlobals {
  setInterval(handler: () => void, ms: number): TimerId;
  clearInterval(id: TimerId): void;
  console: { warn(...args: unknown[]): void };
}

const runtime = globalThis as unknown as RuntimeGlobals;

/** setInterval que no bloquea la salida del proceso (unref en Node si existe). */
export function setIntervalSafe(handler: () => void, ms: number): TimerId {
  const id = runtime.setInterval(handler, ms);
  const maybe = id as unknown as { unref?: () => void };
  if (typeof maybe.unref === 'function') maybe.unref();
  return id;
}

export function clearIntervalSafe(id: TimerId): void {
  runtime.clearInterval(id);
}

export function warn(...args: unknown[]): void {
  runtime.console.warn(...args);
}
