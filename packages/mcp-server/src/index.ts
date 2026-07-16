#!/usr/bin/env node
// Servidor MCP oficial de Prova (transporte stdio). Expone la capa de
// atestaciones a Claude, Cursor y cualquier cliente MCP.
//
// Config por variables de entorno:
//   PROVA_API_URL  — base de la API (default: https://prova-api.fly.dev)
//   PROVA_API_KEY  — opcional, habilita los endpoints premium

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { configFromEnv } from './api.js';
import { tools } from './tools.js';

const VERSION = '0.1.0';

async function main(): Promise<void> {
  const config = configFromEnv();
  const server = new McpServer({ name: 'prova', version: VERSION });

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      { description: tool.description, inputSchema: tool.schema },
      async (args: Record<string, unknown>) => {
        const result = await tool.handler(args ?? {}, config);
        return {
          content: [{ type: 'text' as const, text: result.text }],
          isError: !result.ok,
        };
      }
    );
  }

  await server.connect(new StdioServerTransport());
  // Siempre stderr: stdout es el canal JSON-RPC del protocolo.
  console.error(`prova-mcp-server v${VERSION} ready — API: ${config.apiUrl}`);
}

main().catch((err) => {
  console.error('prova-mcp-server fatal:', err);
  process.exit(1);
});
