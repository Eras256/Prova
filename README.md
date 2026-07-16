# Prova

**Cryptographic receipts for the agentic internet — behavior attestation layer for AI agents on Solana.**

[![CI](https://github.com/Eras256/Prova/actions/workflows/ci.yml/badge.svg)](https://github.com/Eras256/Prova/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/prova-agent-sdk?label=prova-agent-sdk)](https://www.npmjs.com/package/prova-agent-sdk)
[![npm](https://img.shields.io/npm/v/prova-agent-kit?label=prova-agent-kit)](https://www.npmjs.com/package/prova-agent-kit)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)

Prova wraps any AI agent action in a signed, on-chain receipt — verifiable by anyone, tamper-proof, sub-cent. Powered by a **purpose-built Anchor program** with native Ed25519 verification.

> **Prova vs. [SAS](https://attest.solana.com):** SAS provides generic attestation rails. Prova is the full **agent-accountability stack** on top of that concept — an SDK that wraps your agent, an agent/operator model, typed action receipts (ToolCall, ModelInvocation, Decision…), an explorer, and verification. Prova runs its own Anchor program (not the SAS on-chain program).

> **Disclaimer:** Prova is an independent software project and is NOT affiliated with, endorsed by, or sponsored by the Solana Foundation. Solana® is a registered trademark of the Solana Foundation.

---

## Why Prova

When an AI agent executes a DeFi swap, makes an autonomous decision, or calls an external API — there is no independent, tamper-proof record of what happened. Operator logs are controlled by the operator. They can be modified, deleted, or never created.

Prova fixes this with a single primitive: **one `attest()` call → one Ed25519-sealed, on-chain receipt**.

```ts
import { ProvaClient } from 'prova-agent-sdk';

const client = new ProvaClient({ rpcUrl, agentKeypair });

// Hash any structured action payload
const actionHash = await ProvaClient.hashAction(
  JSON.stringify({ protocol: 'jupiter', operation: 'swap', inputMint: 'USDC', amount: '100' })
);

// One Ed25519 proof, sealed on Solana devnet
const receipt = await client.attest({ operatorKeypair, actionHash, actionType: 'Transaction' });
console.log(receipt.explorerUrl);
```

→ **Auditors, regulators, and users can verify what your agent did — without trusting your logs.**

---

## Architecture

```
AI Agent
  └─ SDK (TypeScript or Rust)
       └─ signs action_hash (Ed25519, off-chain)
            └─ record_attestations ix (Anchor, Solana devnet)
                 └─ AttestationIssued event
                      └─ Indexer (Helius WebSocket → Postgres)
                           └─ REST API (Hono / Fly.io)
                                └─ Forensic Explorer (Next.js / Vercel)
```

Key properties:
- **Ed25519 pre-verify**: The Solana runtime validates the agent signature natively — no off-chain trust required.
- **Batch attestations**: Up to 100 receipts per transaction with dynamic `ComputeBudget` priority fees.
- **Privacy mode (Vanish)**: The `action_hash` is committed on-chain while the full payload stays off-chain (`metadataUri`) — selective disclosure. *Confidential / encrypted metadata (to privately record an agent's reasoning) is on the roadmap.*
- **x402 micropayments**: Explorer one-off queries at `$0.01` via HTTP 402 + on-chain SOL transfer.
- **Solana Actions / Blinks**: Any receipt is shareable as a Blink (`/api/actions/verify?tx=<sig>`).

> **Storage model — why events, not one PDA per attestation:** each attestation's cryptographic commitment (`action_hash` + Ed25519 signature) is written on-chain via the `AttestationIssued` event and is permanent. The agent's PDA holds a running `attestation_count` + `policy_root`, not per-attestation data. A PDA per receipt would incur rent on every action and wouldn't scale to high-frequency agents (thousands/day); events + an indexer keep it cheap and queryable, while the on-chain commitment stays verifiable regardless of RPC log retention.

---

## Monorepo Structure

```
apps/
  web/          Next.js 15 — Forensic Explorer, Dashboard, Register/Issue flows
  api/          Hono REST API — attestations, agents, webhooks, x402, admin
  indexer/      WebSocket indexer (Helius onLogs + catch-up polling)
  docs/         Nextra developer documentation
packages/
  program/      Anchor smart contract (Solana devnet: G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1)
  sdk-typescript/  prova-agent-sdk (npm, Apache 2.0)
  sdk-agent-kit/   prova-agent-kit (npm) — Solana Agent Kit v2 adapter
  sdk-rust/     prova-agent-sdk (crates.io, Rust)
  mcp-server/   prova-mcp-server (npm) — MCP server for Claude, Cursor & AI IDEs
  plugin-eliza/ prova-plugin-eliza (npm) — elizaOS plugin, attests every agent action
  db/           Drizzle ORM schema + Supabase Postgres migrations
  core/         Shared types, errors, constants
  ui/           Shared shadcn/ui design system (mono-brutalist)
  config-*/     Shared TypeScript + ESLint configs
tests/
  e2e/          Playwright end-to-end
  integration/  SDK integration tests
```

---

## Quick Start

```bash
# Prerequisites: Node 22+, pnpm 9+
pnpm install

# Dev — all apps
pnpm dev

# Dev — web only
pnpm --filter=@prova/web dev

# Tests
pnpm test

# Build
pnpm build

# Typecheck
pnpm typecheck

# DB migrations (confirm before running)
pnpm db:migrate
```

Copy `.env.example` files and fill in your keys before running:

```
apps/web/.env.example   → apps/web/.env.local
apps/api/.env.example   → apps/api/.env
apps/indexer/.env.example → apps/indexer/.env
```

---

## SDK

```bash
npm install prova-agent-sdk
```

```ts
import { ProvaClient, ProvaApiClient } from 'prova-agent-sdk';

// On-chain operations
const client = new ProvaClient({ rpcUrl, agentKeypair });

await client.registerAgent({ operatorKeypair });
await client.attest({ operatorKeypair, actionHash, actionType: 'Transaction' });
await client.batchAttest({ operatorKeypair, attestations: [...] }); // up to 100

// REST API queries
const api = new ProvaApiClient({ apiUrl: 'https://prova-api.fly.dev', apiKey: 'prova_...' });
const { data } = await api.listAttestations({ limit: 20 });
```

Generate an API key at `/app/api-keys` (requires sign-in).

---

## Solana Agent Kit

Already building with [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit)? Add verifiable receipts to every action your agent takes — in one line.

```bash
npm install prova-agent-kit
```

```ts
import { attachProva, attesterFromProvaClient } from 'prova-agent-kit';
import { ProvaClient } from 'prova-agent-sdk';

const prova = new ProvaClient({ rpcUrl, agentKeypair });
const attester = attesterFromProvaClient(prova, ProvaClient.hashAction, operatorKeypair);

// Wrap your SAK agent — every action it executes is now attested on-chain.
attachProva(agent, { attester });
```

`attachProva()` intercepts each action through SAK's `executeAction` funnel; `ProvaWallet` can also decorate the agent's `BaseWallet` to capture the real on-chain signature. Attestations are batched and fire-and-forget — they never block or break your agent.

---

## elizaOS

Building with [elizaOS](https://github.com/elizaOS/eliza)? One plugin attests every action your agent executes:

```bash
npm install prova-plugin-eliza prova-agent-sdk
```

```ts
import { provaPlugin, attesterFromProvaClient } from 'prova-plugin-eliza';
import { ProvaClient } from 'prova-agent-sdk';

const prova = new ProvaClient({ rpcUrl, agentKeypair });
const attester = attesterFromProvaClient(prova, ProvaClient.hashAction, operatorKeypair);

// plugins: [provaPlugin({ attester })] — every action is now attested on-chain.
```

See [`packages/plugin-eliza`](packages/plugin-eliza).

---

## MCP Server (Claude, Cursor & AI IDEs)

Let your AI assistant query verified attestations natively via the [Model Context Protocol](https://modelcontextprotocol.io):

```bash
# Claude Code
claude mcp add prova -- npx -y prova-mcp-server
```

```json
// Claude Desktop (claude_desktop_config.json) / Cursor (.cursor/mcp.json)
{
  "mcpServers": {
    "prova": { "command": "npx", "args": ["-y", "prova-mcp-server"] }
  }
}
```

9 tools: `get_stats`, `list_attestations`, `get_attestation`, `get_agent`, `get_agent_stats`, `verify_action_hash` (local SHA-256 check against the on-chain hash), plus premium forensics with `PROVA_API_KEY`. See [`packages/mcp-server`](packages/mcp-server).

---

## Solana Actions / Blinks

Every attestation receipt can be shared as a Blink:

```
https://www.theprova.xyz/api/actions/verify?tx=<txSignature>
```

Paste in Twitter/X or any Dialect-compatible wallet to render the receipt as an interactive card.

---

## DeFi Agent Pattern

Prova works with any Solana protocol without modifying it:

```ts
// Attest a Jupiter swap executed by an AI agent
const swapPayload = {
  protocol: 'jupiter', operation: 'exactInSwap',
  inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  outputMint: 'So11111111111111111111111111111111111111112',   // SOL
  inputAmount: '100000000', agentId: operatorKeypair.publicKey.toBase58(),
};
const actionHash = await ProvaClient.hashAction(JSON.stringify(swapPayload));
const receipt = await client.attest({ operatorKeypair, actionHash, actionType: 'Transaction' });
// → Verifiable audit trail for every DeFi action your agent takes
```

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Web (Next.js) | Vercel | https://www.theprova.xyz |
| API (Hono) | Fly.io | https://prova-api.fly.dev |
| Indexer | Fly.io | Internal |
| DB | Supabase Postgres | — |
| Program | Solana devnet | `G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1` |

CI/CD: GitHub Actions → typecheck gates all deploys.

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `HELIUS_RPC_URL` | `web` (server-only) | Helius RPC — proxied via `/api/rpc` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | `web` | WebSocket endpoint (wss://) |
| `NEXT_PUBLIC_PRIVY_APP_ID` | `web` | Privy auth |
| `PRIVY_APP_SECRET` | `web` (server-only) | Privy JWT verification |
| `PROVA_ADMIN_SECRET` | `web` (server-only) | Delegates to API admin endpoint |
| `DATABASE_URL` | `api`, `indexer` | Supabase Postgres pooler |
| `HELIUS_API_KEY` | `indexer` | Helius WebSocket indexer |
| `ADMIN_SECRET` | `api` | Admin endpoint protection |
| `X402_TREASURY_PUBKEY` | `api` | x402 payment destination |

---

## Stack

- **Solana**: Anchor 0.31.0, Solana 2.1.0, Ed25519 native verify
- **Frontend**: Next.js 15, React 19, TypeScript 5, Tailwind CSS v4
- **Backend**: Hono, Node 22, Drizzle ORM, Postgres
- **Auth**: Privy (email + embedded Solana wallets + Phantom/Solflare)
- **Infra**: Turborepo, pnpm workspaces, Fly.io, Vercel, Supabase
- **SDK**: Apache 2.0, ESM + CJS, Node 18+

---

## Security

Report vulnerabilities to **xvaiosx7@gmail.com** — do NOT open public GitHub issues.

---

## License

[Apache 2.0](./LICENSE) — Prova Labs, 2026.
