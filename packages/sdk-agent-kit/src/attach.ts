// Enfoque B: envuelve los handlers de las acciones del agente para atestar cada
// ejecución en Prova. Es el mecanismo principal de captura (semántica rica:
// nombre + input + output). Llamar DESPUÉS de registrar todos los plugins.

import type { AttachProvaOptions, HostAction, HostAgent, ProvaAttester } from './types';
import { buildPayload, mapActionType } from './payload';
import { createBatcher, type Batcher } from './batcher';
import { warn } from './runtime';

export interface ProvaHandle {
  /** Fuerza el envío de las atestaciones pendientes. */
  flush(): Promise<void>;
  /** Detiene el batcher y hace un flush final (llamar al cerrar el agente). */
  stop(): Promise<void>;
}

export function attachProva(agent: HostAgent, options: AttachProvaOptions): ProvaHandle {
  const { attester } = options;
  const should = options.rules ?? (() => true);
  const onError =
    options.onError ??
    ((error: unknown, context: { action: string }) =>
      warn(`[Prova] attest failed for "${context.action}":`, error));

  const batcher = createBatcher(attester, options.batch, (error) =>
    onError(error, { action: 'batch' }),
  );

  agent.actions = agent.actions.map((action: HostAction): HostAction => {
    if (!should(action.name)) return action;
    const original = action.handler;
    return {
      ...action,
      handler: async (a: unknown, input: Record<string, unknown>) => {
        const result = await original(a, input);
        // Atestación NO bloqueante: un fallo de Prova jamás rompe la acción.
        void captureAction(attester, batcher, action.name, input, result).catch((error) =>
          onError(error, { action: action.name }),
        );
        return result;
      },
    };
  });

  return {
    flush: () => batcher.flush(),
    stop: () => batcher.stop(),
  };
}

async function captureAction(
  attester: ProvaAttester,
  batcher: Batcher,
  name: string,
  input: Record<string, unknown>,
  result: Record<string, unknown>,
): Promise<void> {
  const payload = buildPayload(name, input, result);
  const actionHash = await attester.hashAction(JSON.stringify(payload));
  batcher.add({ actionHash, actionType: mapActionType(name, result) });
}
