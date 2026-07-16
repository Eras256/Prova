# prova-mcp-server

Official [Model Context Protocol](https://modelcontextprotocol.io) server for [Prova](https://www.theprova.xyz) — lets Claude, Cursor, and any MCP-compatible client query **verified on-chain AI agent attestations** directly from the model's context.

Ask your assistant things like:

> "What did agent `4QxC…` do in the last 24 hours?"
> "Verify that this payload matches attestation `8fJk…`."
> "Which action types does this agent perform most?"

…and get **cryptographically verifiable answers** backed by Solana, not operator logs.

## Install

No install needed — run it with `npx`. Requires Node.js 18+.

### Claude Code

```bash
claude mcp add prova -- npx -y prova-mcp-server
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prova": {
      "command": "npx",
      "args": ["-y", "prova-mcp-server"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "prova": {
      "command": "npx",
      "args": ["-y", "prova-mcp-server"]
    }
  }
}
```

## Tools

| Tool | Description |
|---|---|
| `get_stats` | Global network stats: registered agents, total attestations |
| `list_attestations` | List receipts, newest first — filter by agent, action type, date range |
| `get_attestation` | One attestation by PDA: action hash, type, signature, timestamp |
| `get_agent` | Agent detail: operator, policy root, attestation count, revoked status |
| `get_agent_stats` | Per-agent activity breakdown by action type |
| `verify_action_hash` | Recompute SHA-256 of a payload and match it against an on-chain hash |
| `get_full_history` | Premium — full history (up to 1000 receipts), needs `PROVA_API_KEY` |
| `get_forensic_report` | Premium — structured forensic report, needs `PROVA_API_KEY` |
| `bulk_verify` | Premium — verify up to 1000 attestation PDAs at once, needs `PROVA_API_KEY` |

## Configuration

Environment variables (all optional):

| Variable | Default | Purpose |
|---|---|---|
| `PROVA_API_URL` | `https://prova-api.fly.dev` | Prova REST API base URL |
| `PROVA_API_KEY` | — | `prova_…` key enabling the premium tools. Get one at [theprova.xyz/app/api-keys](https://www.theprova.xyz/app/api-keys) |

With a key:

```json
{
  "mcpServers": {
    "prova": {
      "command": "npx",
      "args": ["-y", "prova-mcp-server"],
      "env": { "PROVA_API_KEY": "prova_..." }
    }
  }
}
```

## How it works

The server speaks MCP over stdio and reads from the public Prova REST API — the indexed projection of the Prova Anchor program on Solana (`G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1`, Devnet). It is read-only: no keys, no funds, no transactions. Hash verification (`verify_action_hash`) happens locally with Node's crypto.

## License

Apache 2.0 — part of the [Prova](https://github.com/Eras256/Prova) open-source stack.
