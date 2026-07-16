// Tipos del plugin. Reflejamos estructuralmente la API pública de elizaOS
// (Plugin, Action, AgentRuntime) para NO importar @elizaos/core y mantener el
// plugin como dependencia ligera — mismo patrón que prova-agent-kit con SAK.

/**
 * Acción de elizaOS (subconjunto estructural que el plugin necesita).
 * La firma real del handler es (runtime, message, state?, options?, callback?).
 */
export interface ElizaAction {
  name: string;
  handler: (...args: unknown[]) => Promise<unknown>;
  [key: string]: unknown;
}

/** Runtime de elizaOS (subconjunto estructural). */
export interface ElizaRuntime {
  actions: ElizaAction[];
  registerAction?: (action: ElizaAction) => unknown;
  [key: string]: unknown;
}

/** Plugin de elizaOS, en forma estructural. */
export interface ElizaPlugin {
  name: string;
  description: string;
  init?: (config: Record<string, string>, runtime: ElizaRuntime) => Promise<void>;
  [key: string]: unknown;
}
