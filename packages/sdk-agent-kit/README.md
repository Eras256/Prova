# prova-agent-kit

**Prova adapter for [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) (v2).**
Add **verifiable on-chain receipts** to any SAK agent — in one line. Every action your agent executes gets sealed as an immutable Prova attestation.

> Status: **proof of concept** (Devnet). Designed against `solana-agent-kit@^2.0.0`.

## Install

```bash
npm install prova-agent-kit prova-agent-sdk solana-agent-kit
```

## Quick start

```typescript
import { SolanaAgentKit } from 'solana-agent-kit';
import { ProvaClient } from 'prova-agent-sdk';
import { attachProva, attesterFromProvaClient } from 'prova-agent-kit';
import { Keypair } from '@solana/web3.js';

// 1) Tu agente normal de Solana Agent Kit
const agent = new SolanaAgentKit(wallet, RPC_URL, {})
  .use(TokenPlugin)
  .use(DefiPlugin);

// 2) Cliente Prova + operador (keypair propio de Devnet, NO el wallet de trading)
const prova = new ProvaClient({ rpcUrl: 'https://api.devnet.solana.com', agentKeypair });
const operatorKeypair = Keypair.fromSecretKey(/* ... */);
const attester = attesterFromProvaClient(prova, ProvaClient.hashAction, operatorKeypair);

// 3) Una línea: atesta cada acción del agente. Llamar DESPUÉS de todos los .use()
const prova_handle = attachProva(agent, { attester });

// ... el agente opera normal; las acciones se atestan en segundo plano ...

await prova_handle.stop(); // flush final al cerrar
```

## Cómo funciona

Solana Agent Kit v2 no expone hooks/middleware, así que el adapter ofrece dos puntos de captura (úsalos juntos para cobertura total):

- **`attachProva(agent, opts)`** — envuelve `agent.actions[].handler`. Captura **nombre + input + output** de cada acción (incluidas las de solo lectura). Mecanismo principal.
- **`new ProvaWallet(wallet, opts)`** — decorador de `BaseWallet`. Captura la **firma on-chain real** de cada transacción, sin importar el plugin. Cinturón de seguridad.

```typescript
import { ProvaWallet } from 'prova-agent-kit';
const agent = new SolanaAgentKit(new ProvaWallet(realWallet, { attester }), RPC_URL, {});
```

### No bloquea al agente
Las atestaciones son **fire-and-forget con batching**: un fallo de Prova nunca rompe ni frena una acción del agente. Los items se acumulan y se envían con `batchAttest` (hasta 100/tx) cada `maxSize` items o `flushIntervalMs` ms.

```typescript
attachProva(agent, {
  attester,
  rules: (name) => name !== 'fetchPrice',      // qué acciones atestar (default: todas)
  batch: { maxSize: 25, flushIntervalMs: 10_000 },
  onError: (err, ctx) => logger.warn(ctx.action, err),
});
```

## Modelo de claves
Prova atesta con **su propio par operador/agente de Devnet**, independiente del wallet de trading del agente. Ventajas: no necesita la private key de trading, funciona con wallets Privy/Turnkey, y el operador Prova es la identidad que avala al agente. Registra el agente una vez con `prova.registerAgent({ operatorKeypair })`.

## API
- `attachProva(agent, options) → ProvaHandle` · `{ flush(), stop() }`
- `ProvaWallet(inner, options)` implements SAK `BaseWallet`
- `attesterFromProvaClient(client, hashAction, operatorKeypair) → ProvaAttester`
- `createBatcher(attester, options, onError) → Batcher` (interno, exportado para tests)
- `buildPayload`, `mapActionType`, `extractSignature` (puros)

## Caveats
- **Orden:** llama `attachProva` **después** de todos los `.use(plugin)`; las acciones añadidas después no quedan envueltas. El `ProvaWallet` no depende del orden.
- **Tipos:** el adapter usa tipos estructurales de SAK v2 (no importa `solana-agent-kit`). Verifica compatibilidad al fijar versión.

## License
Apache-2.0 · Prova Labs
