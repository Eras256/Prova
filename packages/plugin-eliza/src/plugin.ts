// Plugin Prova para elizaOS: en init() envuelve el handler de cada acción
// registrada (y de las que se registren después) para atestar cada ejecución
// on-chain. Reutiliza el batcher y el builder de payloads de prova-agent-kit.
// La atestación es fire-and-forget: un fallo de Prova jamás rompe la acción.

import {
  createBatcher,
  buildPayload,
  mapActionType,
  type Batcher,
  type BatchOptions,
  type ProvaAttester,
} from 'prova-agent-kit';
import type { ElizaAction, ElizaPlugin, ElizaRuntime } from './types';

export interface ProvaPluginOptions {
  /** Puente hacia Prova (ver `attesterFromProvaClient` en prova-agent-kit). */
  attester: ProvaAttester;
  /** Filtra qué acciones atestar por nombre (default: todas). */
  rules?: (actionName: string) => boolean;
  /** Configuración de batching (maxSize, flushDelayMs). */
  batch?: BatchOptions;
  /** Manejo de errores (default: warn por consola). Nunca rompe la acción. */
  onError?: (error: unknown, context: { action: string }) => void;
}

export interface ProvaPluginHandle {
  /** El plugin listo para el array `plugins` del agente eliza. */
  plugin: ElizaPlugin;
  /** Fuerza el envío de las atestaciones pendientes. */
  flush(): Promise<void>;
  /** Detiene el batcher y hace un flush final (llamar al apagar el agente). */
  stop(): Promise<void>;
}

// El handler de eliza recibe (runtime, message, state?, options?, callback?).
// Del message extraemos `content` como input semántico de la atestación.
function extractInput(args: unknown[]): Record<string, unknown> {
  const message = args[1];
  if (message && typeof message === 'object') {
    const content = (message as Record<string, unknown>).content;
    if (content && typeof content === 'object') return content as Record<string, unknown>;
  }
  return {};
}

// Los handlers de eliza pueden devolver boolean/void — el payload necesita Record.
function coerceResult(result: unknown): Record<string, unknown> {
  if (result && typeof result === 'object' && !Array.isArray(result)) {
    return result as Record<string, unknown>;
  }
  return { value: result ?? null };
}

async function captureAction(
  attester: ProvaAttester,
  batcher: Batcher,
  name: string,
  args: unknown[],
  result: unknown
): Promise<void> {
  const payload = buildPayload(name, extractInput(args), coerceResult(result));
  const actionHash = await attester.hashAction(JSON.stringify(payload));
  batcher.add({ actionHash, actionType: mapActionType(name, coerceResult(result)) });
}

/**
 * Crea el plugin Prova para elizaOS junto a su handle de control.
 *
 * @example
 * const attester = attesterFromProvaClient(prova, ProvaClient.hashAction, operatorKeypair);
 * const { plugin, stop } = createProvaPlugin({ attester });
 * const runtime = new AgentRuntime({ ...opts, plugins: [plugin] });
 */
export function createProvaPlugin(options: ProvaPluginOptions): ProvaPluginHandle {
  const { attester } = options;
  const should = options.rules ?? (() => true);
  const onError =
    options.onError ??
    ((error: unknown, context: { action: string }) =>
      console.warn(`[Prova] attest failed for "${context.action}":`, error));

  const batcher = createBatcher(attester, options.batch, (error) =>
    onError(error, { action: 'batch' })
  );

  const wrapAction = (action: ElizaAction): ElizaAction => {
    if (!should(action.name)) return action;
    const original = action.handler;
    return {
      ...action,
      handler: async (...args: unknown[]) => {
        const result = await original(...args);
        void captureAction(attester, batcher, action.name, args, result).catch((error) =>
          onError(error, { action: action.name })
        );
        return result;
      },
    };
  };

  const plugin: ElizaPlugin = {
    name: 'prova',
    description:
      'Verifiable on-chain receipts for every action the agent executes (theprova.xyz)',
    init: async (_config, runtime: ElizaRuntime) => {
      // Envuelve las acciones ya registradas…
      runtime.actions = runtime.actions.map(wrapAction);
      // …y las que otros plugins registren después de init.
      const originalRegister = runtime.registerAction?.bind(runtime);
      if (originalRegister) {
        runtime.registerAction = (action: ElizaAction) => originalRegister(wrapAction(action));
      }
    },
  };

  return {
    plugin,
    flush: () => batcher.flush(),
    stop: () => batcher.stop(),
  };
}

/**
 * Atajo cuando no necesitas el handle: devuelve solo el plugin.
 * El flush final queda a cargo del debounce del batcher.
 */
export function provaPlugin(options: ProvaPluginOptions): ElizaPlugin {
  return createProvaPlugin(options).plugin;
}
