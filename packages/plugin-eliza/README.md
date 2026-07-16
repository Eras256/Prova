# prova-plugin-eliza

Official [Prova](https://www.theprova.xyz) plugin for [elizaOS](https://github.com/elizaOS/eliza) agents — every action your eliza agent executes gets a **verifiable, Ed25519-signed receipt on Solana**. Tamper-proof accountability without touching your agent logic.

## Install

```bash
npm install prova-plugin-eliza prova-agent-sdk
```

## Quick start

```ts
import { provaPlugin, attesterFromProvaClient } from 'prova-plugin-eliza';
import { ProvaClient } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const prova = new ProvaClient({
  rpcUrl: process.env.PROVA_RPC_URL!,
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});

const attester = attesterFromProvaClient(
  prova,
  ProvaClient.hashAction,
  operatorKeypair,
);

// Add to your runtime's plugins — every action is now attested on-chain:
const runtime = new AgentRuntime({
  // ...your character, model provider, etc.
  plugins: [provaPlugin({ attester })],
});
```

Need explicit flush control (e.g. on shutdown)?

```ts
import { createProvaPlugin } from 'prova-plugin-eliza';

const { plugin, flush, stop } = createProvaPlugin({ attester });
// plugins: [plugin] …
await stop(); // guaranteed final flush when the agent shuts down
```

## How it works

- On `init`, the plugin wraps the handler of every registered action — and hooks `registerAction` so actions registered later are wrapped too.
- After each handler resolves, the plugin builds a payload from the action name, the message content, and the result; hashes it (SHA-256) and queues the attestation.
- A debounced batcher groups bursts of actions into **one Solana transaction** (up to 100 receipts).
- Attestation is fire-and-forget: a Prova failure never breaks or slows down the agent action.

The plugin never imports `@elizaos/core` — it relies on TypeScript structural typing, so it stays dependency-light across eliza versions.

## Options

| Option | Default | Description |
|---|---|---|
| `attester` | — | Bridge to Prova. Build with `attesterFromProvaClient(client, hashAction, operatorKeypair)` |
| `rules` | attest all | Predicate by action name — return `false` to skip |
| `batch.maxSize` | `25` | Immediate flush at N queued items (1–100 per tx) |
| `batch.flushDelayMs` | `1000` | Debounce: flush N ms after the last action |
| `onError` | console warn | Called on attestation failure; the action itself is never affected |

## License

Apache 2.0 — part of the [Prova](https://github.com/Eras256/Prova) open-source stack.
