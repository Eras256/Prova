// Definición de las tools MCP como datos + funciones puras: cada tool declara
// su schema Zod y un handler que devuelve texto (JSON legible). index.ts las
// registra en el servidor MCP; los tests las ejercitan directamente.

import { createHash } from 'node:crypto';
import { z } from 'zod';
import { apiGet, apiPost, toQuery, type ApiConfig, type ApiResult } from './api.js';

export type ToolResult = { ok: true; text: string } | { ok: false; text: string };

export interface ToolDef {
  name: string;
  description: string;
  schema: z.ZodRawShape;
  handler: (args: Record<string, unknown>, config: ApiConfig) => Promise<ToolResult>;
}

const ACTION_TYPES = [
  'Transaction',
  'ToolCall',
  'ModelInvocation',
  'Decision',
  'ResourceAccess',
  'PolicyCheck',
  'Custom',
] as const;

function fromApi<T>(result: ApiResult<T>): ToolResult {
  if (!result.ok) return { ok: false, text: `Prova API error: ${result.error}` };
  return { ok: true, text: JSON.stringify(result.data, null, 2) };
}

function requireKey(config: ApiConfig): ToolResult | null {
  if (config.apiKey) return null;
  return {
    ok: false,
    text:
      'This is a premium endpoint and no API key is configured. ' +
      'Set the PROVA_API_KEY environment variable (get a key at https://www.theprova.xyz/app/api-keys).',
  };
}

export function sha256Hex(payload: string): string {
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

/** Normaliza un hash hex para comparar (minúsculas, sin prefijo 0x). */
function normalizeHash(hash: string): string {
  return hash.trim().toLowerCase().replace(/^0x/, '');
}

export const tools: ToolDef[] = [
  {
    name: 'get_stats',
    description:
      'Get global Prova network stats: total registered AI agents and total on-chain attestations.',
    schema: {},
    handler: async (_args, config) => fromApi(await apiGet(config, '/api/v1/stats')),
  },
  {
    name: 'list_attestations',
    description:
      'List on-chain attestations (verifiable receipts of AI agent actions), newest first. ' +
      'Filter by agent PDA, action type, or ISO-8601 date range. Paginated.',
    schema: {
      agentPda: z.string().optional().describe('Filter by agent PDA (base58 address)'),
      actionType: z.enum(ACTION_TYPES).optional().describe('Filter by action type'),
      from: z.string().optional().describe('ISO 8601 start date, e.g. 2026-07-01T00:00:00Z'),
      to: z.string().optional().describe('ISO 8601 end date'),
      limit: z.number().int().min(1).max(100).optional().describe('Page size (default 20)'),
      offset: z.number().int().min(0).optional().describe('Pagination offset'),
    },
    handler: async (args, config) => {
      const qs = toQuery({
        agentPda: args.agentPda as string | undefined,
        actionType: args.actionType as string | undefined,
        from: args.from as string | undefined,
        to: args.to as string | undefined,
        limit: args.limit as number | undefined,
        offset: args.offset as number | undefined,
      });
      return fromApi(await apiGet(config, `/api/v1/attestations${qs}`));
    },
  },
  {
    name: 'get_attestation',
    description:
      'Get one attestation by its PDA: action hash, type, Ed25519 signature, timestamp, agent.',
    schema: {
      pda: z.string().describe('Attestation PDA (base58 address)'),
    },
    handler: async (args, config) =>
      fromApi(
        await apiGet(config, `/api/v1/attestations/${encodeURIComponent(args.pda as string)}`)
      ),
  },
  {
    name: 'get_agent',
    description:
      'Get a registered AI agent by ID or PDA: operator, policy root, attestation count, revoked status.',
    schema: {
      agentId: z.string().describe('Agent ID or agent PDA (base58 address)'),
    },
    handler: async (args, config) =>
      fromApi(await apiGet(config, `/api/v1/agents/${encodeURIComponent(args.agentId as string)}`)),
  },
  {
    name: 'get_agent_stats',
    description:
      'Get per-agent activity stats: total attestations, breakdown by action type, recent receipts.',
    schema: {
      agentId: z.string().describe('Agent ID or agent PDA (base58 address)'),
    },
    handler: async (args, config) =>
      fromApi(
        await apiGet(
          config,
          `/api/v1/agents/${encodeURIComponent(args.agentId as string)}/stats`
        )
      ),
  },
  {
    name: 'verify_action_hash',
    description:
      'Recompute the SHA-256 of an action payload and check it against an on-chain attestation. ' +
      'Pass the exact payload string plus either an attestation PDA (fetched from the API) or an expected hash. ' +
      'A match proves the attested action is exactly this payload.',
    schema: {
      payload: z.string().describe('The exact action payload string that was hashed'),
      attestationPda: z
        .string()
        .optional()
        .describe('Attestation PDA to verify against (its actionHash is fetched)'),
      expectedHash: z
        .string()
        .optional()
        .describe('Hex-encoded SHA-256 to compare against (alternative to attestationPda)'),
    },
    handler: async (args, config) => {
      const computed = sha256Hex(args.payload as string);
      const pda = args.attestationPda as string | undefined;
      const expected = args.expectedHash as string | undefined;

      if (!pda && !expected) {
        return {
          ok: true,
          text: JSON.stringify({ computedHash: computed }, null, 2),
        };
      }

      let onChainHash = expected;
      if (pda) {
        const result = await apiGet<{ data: { actionHash: string } }>(
          config,
          `/api/v1/attestations/${encodeURIComponent(pda)}`
        );
        if (!result.ok) return { ok: false, text: `Prova API error: ${result.error}` };
        onChainHash = result.data.data.actionHash;
      }

      const match = normalizeHash(computed) === normalizeHash(onChainHash ?? '');
      return {
        ok: true,
        text: JSON.stringify(
          {
            match,
            computedHash: computed,
            expectedHash: onChainHash,
            verdict: match
              ? 'VERIFIED — the payload hashes to the attested action hash'
              : 'MISMATCH — this payload does NOT correspond to the attested action',
          },
          null,
          2
        ),
      };
    },
  },
  {
    name: 'get_full_history',
    description:
      'Premium: full attestation history of an agent (up to 1000 receipts). Requires PROVA_API_KEY.',
    schema: {
      agentId: z.string().describe('Agent ID or agent PDA (base58 address)'),
    },
    handler: async (args, config) => {
      const missing = requireKey(config);
      if (missing) return missing;
      return fromApi(
        await apiGet(
          config,
          `/api/v1/premium/full-history/${encodeURIComponent(args.agentId as string)}`
        )
      );
    },
  },
  {
    name: 'get_forensic_report',
    description:
      'Premium: structured forensic report for an agent, suitable for audits and compliance. Requires PROVA_API_KEY.',
    schema: {
      agentId: z.string().describe('Agent ID or agent PDA (base58 address)'),
    },
    handler: async (args, config) => {
      const missing = requireKey(config);
      if (missing) return missing;
      return fromApi(
        await apiGet(
          config,
          `/api/v1/premium/forensic-report/${encodeURIComponent(args.agentId as string)}`
        )
      );
    },
  },
  {
    name: 'bulk_verify',
    description:
      'Premium: verify up to 1000 attestation PDAs in one call. Requires PROVA_API_KEY.',
    schema: {
      ids: z.array(z.string()).min(1).max(1000).describe('Attestation PDAs to verify'),
    },
    handler: async (args, config) => {
      const missing = requireKey(config);
      if (missing) return missing;
      return fromApi(await apiPost(config, '/api/v1/premium/bulk-verify', { ids: args.ids }));
    },
  },
];
