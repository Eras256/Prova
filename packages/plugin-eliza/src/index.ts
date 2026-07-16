// API pública del plugin Prova para elizaOS.

export { provaPlugin, createProvaPlugin } from './plugin';
export type { ProvaPluginOptions, ProvaPluginHandle } from './plugin';

export type { ElizaAction, ElizaPlugin, ElizaRuntime } from './types';

// Re-export del puente al ProvaClient real para que el integrador no tenga
// que instalar prova-agent-kit por separado.
export { attesterFromProvaClient } from 'prova-agent-kit';
export type { ProvaAttester, BatchOptions, ProvaClientLike } from 'prova-agent-kit';
