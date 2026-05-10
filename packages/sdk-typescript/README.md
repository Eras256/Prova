# prova-agent-sdk

Official TypeScript SDK for **Prova** — behavior attestation for AI agents on Solana.

Wrap any agent action in a cryptographic receipt. Every action your agent executes gets sealed on-chain as an immutable record, verifiable by anyone without depending on off-chain logs.

## Install

```bash
npm install prova-agent-sdk
```

## Quick Start

```typescript
import { ProvaClient, ProvaApiClient, AttestationBuilder } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

// ── On-chain: register & attest ─────────────────────────────────────────────
const prova = new ProvaClient({
  rpcUrl: 'https://api.devnet.solana.com',
  agentKeypair: Keypair.fromSecretKey(agentSecretBytes),
});

// Register your agent on-chain (once per operator)
const { agentPda } = await prova.registerAgent({ operatorKeypair });

// Attest an action
const payload = AttestationBuilder.transaction('your-tx-signature', { amount: 100, token: 'USDC' });
const hash = await ProvaClient.hashAction(JSON.stringify(payload));

const { txSignature, explorerUrl } = await prova.attest({
  operatorKeypair,
  actionHash: hash,
  actionType: 'Transaction',
});

console.log('Receipt:', explorerUrl);

// ── Off-chain: query indexed data ────────────────────────────────────────────
const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...', // required for premium endpoints
});

const { data, pagination } = await api.listAttestations({ agentPda: agentPda.toBase58(), limit: 10 });
```

## API

### `new ProvaClient(config)` — on-chain client

| Parameter | Type | Description |
|---|---|---|
| `rpcUrl` | `string` | Solana RPC URL (devnet or mainnet) |
| `agentKeypair` | `Keypair` | Agent keypair — signs each action hash off-chain via Ed25519 |
| `programId` | `string` (optional) | Prova program ID. Defaults to the deployed devnet program |

#### `prova.registerAgent(params)`

Registers the agent on-chain and creates the AgentAccount PDA. Call once per operator.

```typescript
const { txSignature, agentPda, explorerUrl } = await prova.registerAgent({
  operatorKeypair,
  policyRoot, // optional — 32-byte Merkle root
});
```

#### `prova.attest(params)`

Emits a single attestation on-chain.

```typescript
const { txSignature, explorerUrl } = await prova.attest({
  operatorKeypair,
  actionHash,   // 32-byte sha256 of the action payload
  actionType,   // see Action Types table below
  privacyMode,  // optional — hash stays on-chain, payload stays off-chain
});
```

#### `prova.batchAttest(params)`

Emits up to 100 attestations in a single transaction.

```typescript
await prova.batchAttest({
  operatorKeypair,
  attestations: [
    { actionHash: hash1, actionType: 'Transaction' },
    { actionHash: hash2, actionType: 'ToolCall' },
  ],
});
```

#### `prova.getAgentAccount(operator)`

Fetches the on-chain AgentAccount.

```typescript
const account = await prova.getAgentAccount(operatorKeypair.publicKey);
console.log(account.attestationCount);
```

#### `prova.isAgentActive(operator)`

Returns `true` if the agent is registered and not revoked.

#### `prova.revokeAgent(params)`

Revokes the agent. Irreversible — attestations after this point will fail.

#### `prova.updatePolicyRoot(params)`

Updates the 32-byte Merkle policy root without re-registering.

#### `ProvaClient.hashAction(data)` (static)

SHA-256 hashes any string into a 32-byte `Uint8Array`.

```typescript
const hash = await ProvaClient.hashAction('any string or JSON');
```

---

### `new ProvaApiClient(config)` — REST API client

Query the indexed attestation data without touching Solana directly.

| Parameter | Type | Description |
|---|---|---|
| `apiUrl` | `string` | Prova API base URL — `https://prova-api.fly.dev` |
| `apiKey` | `string` (optional) | `prova_...` key. Required for premium endpoints |

#### Public endpoints (no API key)

```typescript
// List attestations with optional filters
const { data, pagination } = await api.listAttestations({
  agentPda: '...',
  actionType: 'Transaction',
  from: '2026-01-01T00:00:00Z',
  limit: 50,
  offset: 0,
});

// Get a single attestation
const attestation = await api.getAttestation(pda);

// Verify an attestation exists
const { valid, attestation } = await api.verifyAttestation(pda);

// Get agent info
const agent = await api.getAgent(agentId);

// Get agent stats + recent attestations
const stats = await api.getAgentStats(agentId);
```

#### Premium endpoints (API key required)

```typescript
// Verify up to 1000 attestations in one call
const results = await api.bulkVerify([pda1, pda2, pda3]);

// Full attestation history (up to 1000)
const { agent, data } = await api.getFullHistory(agentId);

// Forensic report with summary stats
const { agent, summary } = await api.getForensicReport(agentId);
```

---

### `AttestationBuilder`

Fluent builder for typed attestation payloads.

```typescript
// Static factory methods
AttestationBuilder.transaction(txSignature, extraFields?)
AttestationBuilder.toolCall(toolName, args?)
AttestationBuilder.modelInvocation(model, promptHash, extra?)
AttestationBuilder.decision(choice, rationale?, extra?)
AttestationBuilder.resourceAccess(resource, method, extra?)
AttestationBuilder.policyCheck(policy, 'pass' | 'fail', extra?)
AttestationBuilder.custom(payload, metadata?)

// Or fluent builder
const payload = new AttestationBuilder()
  .setActionType('Decision')
  .setPayload({ decision: 'approve', confidence: 0.97 })
  .setMetadata({ agentVersion: '1.0.0' })
  .build();

const hash = await ProvaClient.hashAction(JSON.stringify(payload));
```

---

## Action Types

| Type | Use case |
|---|---|
| `Transaction` | On-chain transaction executed by the agent |
| `Decision` | Autonomous decision made by the agent |
| `ModelInvocation` | LLM or model call made by the agent |
| `ToolCall` | External tool or function called by the agent |
| `ResourceAccess` | Data read or external resource fetched |
| `PolicyCheck` | Policy or permission check evaluated |
| `Custom` | Any other action type |

## Privacy Mode (Vanish)

Pass `privacyMode: true` to keep the action hash on-chain while the payload stays off-chain. Enables selective disclosure without revealing content.

```typescript
await prova.attest({
  operatorKeypair,
  actionHash: hash,
  privacyMode: true,
});
```

## Links

- [Explorer](https://prova.io/explorer)
- [Documentation](https://prova.io/developers)
- [SDK Reference](https://prova.io/developers/sdks)
- [GitHub](https://github.com/Eras256/Prova)

## License

Apache-2.0
