import type { LocalizedDoc } from './types';
import { overview } from './overview';
import { gettingStarted } from './getting-started';
import { coreConcepts } from './core-concepts';
import { sdkTypescript } from './sdk-typescript';
import { agentKit } from './agent-kit';
import { sdkRust } from './sdk-rust';
import { mcpServer } from './mcp-server';
import { apiReference } from './api-reference';
import { program } from './program';

// Registro slug → contenido. '' es la página índice (/developers/docs).
export const docsRegistry: Record<string, LocalizedDoc> = {
  '': overview,
  'getting-started': gettingStarted,
  'core-concepts': coreConcepts,
  'sdk-typescript': sdkTypescript,
  'agent-kit': agentKit,
  'sdk-rust': sdkRust,
  'mcp-server': mcpServer,
  'api-reference': apiReference,
  'program': program,
};
