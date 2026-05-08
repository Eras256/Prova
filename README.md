# Prova

**Cryptographic receipts for the agentic internet.**

Prova is a behavior attestation layer that issues verifiable, signed, immutable receipts of every AI agent action on Solana, built on top of the [Solana Attestation Service (SAS)](https://attest.solana.com).

> DISCLAIMER: Prova is an independent project and is NOT affiliated with, endorsed by, or sponsored by the Solana Foundation. Solana® is a registered trademark of the Solana Foundation.

## What is Prova?

When an AI agent:
- Executes a financial transaction
- Makes a consequential decision
- Invokes a tool or external service
- Accesses a resource

Prova issues a **cryptographic attestation** on-chain — a tamper-proof, verifiable receipt signed by the agent and anchored to Solana's immutable ledger.

## Monorepo Structure

```
prova/
├── apps/
│   ├── web/          # Next.js 15 frontend (Forensic Explorer + Dashboard)
│   ├── docs/         # Nextra documentation site
│   ├── api/          # Hono REST API + x402 payment gateway
│   └── indexer/      # Helius LaserStream consumer
├── packages/
│   ├── program/      # Anchor smart contract (Solana)
│   ├── sdk-typescript/  # @prova/sdk
│   ├── sdk-rust/     # prova-sdk (Rust)
│   ├── ui/           # Shared shadcn/ui components
│   ├── db/           # Drizzle schema + migrations
│   ├── core/         # Shared types + utilities
│   ├── config-eslint/
│   └── config-typescript/
└── tests/
    ├── e2e/          # Playwright E2E
    └── integration/
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Run tests
pnpm test

# Build everything
pnpm build
```

## Sponsor Stack

- [Solana Attestation Service](https://attest.solana.com) — attestation infrastructure
- [Helius LaserStream](https://docs.helius.dev/laserstream) — real-time indexing
- [Vanish Core API](https://core.vanish.trade) — privacy mode
- [Coinbase x402](https://docs.cdp.coinbase.com/x402) — pay-per-query monetization
- [Phantom Connect](https://docs.phantom.com/phantom-connect) — wallet integration

## License

Apache 2.0 — see [LICENSE](./LICENSE).

## Security

For security issues, email security@prova.io. Do NOT open public GitHub issues for security vulnerabilities.
