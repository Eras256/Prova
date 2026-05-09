# prova-agent-sdk

Official TypeScript SDK for **Prova** — behavior attestation for AI agents on Solana.

Wrap any agent action in a cryptographic receipt. Every action your agent executes gets sealed on-chain as an immutable record, verifiable by anyone without depending on off-chain logs.

## Install

```bash
npm install prova-agent-sdk
```

## Quick Start

```typescript
import { ProvaClient, AttestationBuilder } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const prova = new ProvaClient({
  rpcUrl: 'https://api.devnet.solana.com',
  agentKeypair: Keypair.fromSecretKey(agentSecretBytes),
});

// Register your agent on-chain
const { agentPda } = await prova.registerAgent({
  operatorKeypair,
});

// Attest an action
const payload = AttestationBuilder.transaction('your-tx-signature', { amount: 100, token: 'USDC' });
const hash = await ProvaClient.hashAction(JSON.stringify(payload));

const { txSignature, explorerUrl } = await prova.attest({
  operatorKeypair,
  actionHash: hash,
  actionType: 'Transaction',
});

console.log('Receipt:', explorerUrl);
```

## API

### `new ProvaClient(config)`

| Parameter | Type | Description |
|---|---|---|
| `rpcUrl` | `string` | Solana RPC URL (devnet or mainnet) |
| `agentKeypair` | `Keypair` | Agent keypair — signs each action hash off-chain via Ed25519 |
| `programId` | `string` (optional) | Prova program ID. Defaults to the deployed devnet program |

### `prova.registerAgent(params)`

Registers the agent on-chain and creates the AgentAccount PDA.

```typescript
const { txSignature, agentPda, explorerUrl } = await prova.registerAgent({
  operatorKeypair,
  policyRoot, // optional — 32-byte Merkle root
});
```

### `prova.attest(params)`

Emits a single attestation on-chain.

```typescript
const { txSignature, explorerUrl } = await prova.attest({
  operatorKeypair,
  actionHash,          // 32-byte sha256 of the action payload
  actionType,          // 'Transaction' | 'ToolCall' | 'Decision' | 'DataAccess' | 'ApiCall' | 'Custom'
  privacyMode,         // optional — hash stays on-chain, payload stays off-chain (Vanish)
});
```

### `prova.batchAttest(params)`

Emits up to 10 attestations in a single transaction.

```typescript
await prova.batchAttest({
  operatorKeypair,
  attestations: [
    { actionHash: hash1, actionType: 'Transaction' },
    { actionHash: hash2, actionType: 'ToolCall' },
  ],
});
```

### `prova.getAgent(operatorPubkey)`

Fetches the on-chain AgentAccount.

```typescript
const agent = await prova.getAgent(operatorKeypair.publicKey);
console.log(agent.attestationCount);
```

### `AttestationBuilder`

Fluent builder for typed attestation payloads.

```typescript
// Factory methods
AttestationBuilder.transaction(txSignature, extraFields?)
AttestationBuilder.toolCall(toolName, args?)

// Or use the builder directly
const payload = new AttestationBuilder()
  .setActionType('Decision')
  .setPayload({ decision: 'approve', confidence: 0.97 })
  .setMetadata({ agentVersion: '1.0.0' })
  .build();

const hash = await ProvaClient.hashAction(JSON.stringify(payload));
```

### `ProvaClient.hashAction(data)`

Static helper — SHA-256 hashes any string into a 32-byte `Uint8Array`.

```typescript
const hash = await ProvaClient.hashAction('any string or JSON');
```

## Action Types

| Type | Use case |
|---|---|
| `Transaction` | On-chain transaction executed by the agent |
| `ToolCall` | External tool or API called by the agent |
| `Decision` | Autonomous decision made by the agent |
| `DataAccess` | Data read or fetched by the agent |
| `ApiCall` | REST/RPC call made by the agent |
| `Custom` | Any other action type |

## Privacy Mode (Vanish)

Pass `privacyMode: true` to keep the action hash on-chain while the payload stays off-chain. This enables selective disclosure without revealing content.

```typescript
await prova.attest({
  operatorKeypair,
  actionHash: hash,
  privacyMode: true,
});
```

## Links

- [Explorer](https://prova-solana.vercel.app/explorer)
- [Documentation](https://prova-solana.vercel.app/developers)
- [GitHub](https://github.com/Eras256/Prova)

## License

Apache-2.0
