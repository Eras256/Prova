import type { LocalizedDoc } from './types';

const configCode = `import { ProvaClient } from 'prova-agent-sdk';

const client = new ProvaClient({
  rpcUrl: 'https://devnet.helius-rpc.com/?api-key=...',
  agentKeypair,          // signs every action hash (Ed25519)
  // programId?: string  // defaults to the Devnet deployment
});`;

const hashCode = `// Static helper — SHA-256 of any string payload → 32-byte Uint8Array
const actionHash = await ProvaClient.hashAction(JSON.stringify(payload));`;

const lifecycleCode = `// Register (once per operator)
const reg = await client.registerAgent({ operatorKeypair, policyRoot });

// Attest a single action
const receipt = await client.attest({
  operatorKeypair,
  actionHash,
  actionType: 'ToolCall',
  privacyMode: false,
});

// Batch up to 100 actions in one transaction
await client.batchAttest({
  operatorKeypair,
  attestations: [{ actionHash, actionType: 'Decision' }],
});

// Rotate the policy Merkle root
await client.updatePolicyRoot({ operatorKeypair, newRoot });

// Kill switch — permanently marks the agent as revoked
await client.revokeAgent({ operatorKeypair });`;

const readCode = `// Read the on-chain agent account
const account = await client.getAgentAccount(operator.publicKey);
// → { agentId, policyRoot, attestationCount, createdAt, revoked, ... }

const active = await client.isAgentActive(operator.publicKey);

// Decode recent attestations straight from chain logs (no API needed)
const recent = await client.getRecentAttestations(agentPda, { limit: 25 });

// Derive the agent PDA locally
const [agentPda, bump] = client.deriveAgentPda(operator.publicKey);`;

const apiClientCode = `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...', // only needed for premium endpoints
});

// Public
const { data, pagination } = await api.listAttestations({
  agentPda, actionType: 'Transaction', limit: 50, offset: 0,
});
const attestation = await api.getAttestation(pda);
const agent = await api.getAgent(agentId);
const stats = await api.getAgentStats(agentId);

// Premium (API key + x402)
const results = await api.bulkVerify([id1, id2, id3]);   // up to 1000
const history = await api.getFullHistory(agentId);       // up to 1000 receipts
const report  = await api.getForensicReport(agentId);`;

const errorCode = `import { BatchLimitExceededError } from 'prova-agent-sdk';

try {
  await client.batchAttest({ operatorKeypair, attestations });
} catch (e) {
  if (e instanceof BatchLimitExceededError) {
    // split the batch: max 100 attestations per transaction
  }
}`;

export const sdkTypescript: LocalizedDoc = {
  EN: {
    title: 'TypeScript SDK',
    intro:
      'Complete reference for `prova-agent-sdk` — the npm package that talks directly to the Anchor program over RPC (writes) and to the REST API (reads). Apache 2.0, no backend intermediary.',
    blocks: [
      { kind: 'h2', text: 'Installation & setup' },
      { kind: 'code', code: `npm install prova-agent-sdk` },
      { kind: 'code', title: 'ProvaClient configuration', code: configCode },
      {
        kind: 'table',
        headers: ['Option', 'Type', 'Description'],
        rows: [
          ['`rpcUrl`', '`string`', 'Solana RPC endpoint (devnet/mainnet). Helius recommended.'],
          ['`agentKeypair`', '`Keypair`', 'Agent identity. Signs each `action_hash` off-chain via Ed25519.'],
          ['`programId?`', '`string`', 'Prova program ID. Defaults to the Devnet deployment (`G11d…`).'],
        ],
      },
      { kind: 'h2', text: 'Hashing actions' },
      { kind: 'code', code: hashCode },
      {
        kind: 'p',
        text: 'Hash the exact structured payload you would show an auditor. Determinism is the point: the same payload always yields the same hash, making receipts independently recomputable.',
      },
      { kind: 'h2', text: 'On-chain lifecycle' },
      { kind: 'code', code: lifecycleCode },
      {
        kind: 'table',
        headers: ['Method', 'Returns', 'Notes'],
        rows: [
          ['`registerAgent({ operatorKeypair, policyRoot? })`', '`{ txSignature, agentPda, explorerUrl }`', 'Creates the agent PDA. One per operator; ~0.001 SOL rent.'],
          ['`attest({ operatorKeypair, actionHash, actionType?, privacyMode? })`', '`{ txSignature, explorerUrl }`', '`actionHash` must be exactly 32 bytes. Default type: `Transaction`.'],
          ['`batchAttest({ operatorKeypair, attestations })`', '`{ txSignature, explorerUrl }`', '1–100 entries; throws `BatchLimitExceededError` above 100.'],
          ['`updatePolicyRoot({ operatorKeypair, newRoot })`', '`{ txSignature, explorerUrl }`', 'Rotates the 32-byte policy Merkle root.'],
          ['`revokeAgent({ operatorKeypair })`', '`{ txSignature, explorerUrl }`', 'Irreversible kill switch. Revoked agents cannot attest.'],
        ],
      },
      { kind: 'h2', text: 'Reading on-chain state' },
      { kind: 'code', code: readCode },
      { kind: 'h2', text: 'REST API client' },
      {
        kind: 'p',
        text: '`ProvaApiClient` queries the indexed layer — use it for dashboards, audits, and verification flows where you read rather than write.',
      },
      { kind: 'code', code: apiClientCode },
      { kind: 'h2', text: 'Error handling' },
      { kind: 'code', code: errorCode },
      {
        kind: 'callout',
        tone: 'info',
        text: 'All write methods surface Solana transaction errors as-is (e.g. insufficient funds, blockhash expiry) so you can retry with your own policy.',
      },
    ],
  },
  ES: {
    title: 'SDK TypeScript',
    intro:
      'Referencia completa de `prova-agent-sdk` — el paquete npm que habla directamente con el programa Anchor vía RPC (escrituras) y con la API REST (lecturas). Apache 2.0, sin backend intermedio.',
    blocks: [
      { kind: 'h2', text: 'Instalación y setup' },
      { kind: 'code', code: `npm install prova-agent-sdk` },
      { kind: 'code', title: 'Configuración de ProvaClient', code: configCode },
      {
        kind: 'table',
        headers: ['Opción', 'Tipo', 'Descripción'],
        rows: [
          ['`rpcUrl`', '`string`', 'Endpoint RPC de Solana (devnet/mainnet). Se recomienda Helius.'],
          ['`agentKeypair`', '`Keypair`', 'Identidad del agente. Firma cada `action_hash` off-chain vía Ed25519.'],
          ['`programId?`', '`string`', 'Program ID de Prova. Por defecto el despliegue en Devnet (`G11d…`).'],
        ],
      },
      { kind: 'h2', text: 'Hashear acciones' },
      { kind: 'code', code: hashCode },
      {
        kind: 'p',
        text: 'Hashea exactamente el payload estructurado que le mostrarías a un auditor. El determinismo es el punto: el mismo payload produce siempre el mismo hash, haciendo los recibos recomputables de forma independiente.',
      },
      { kind: 'h2', text: 'Ciclo de vida on-chain' },
      { kind: 'code', code: lifecycleCode },
      {
        kind: 'table',
        headers: ['Método', 'Devuelve', 'Notas'],
        rows: [
          ['`registerAgent({ operatorKeypair, policyRoot? })`', '`{ txSignature, agentPda, explorerUrl }`', 'Crea la PDA del agente. Una por operador; ~0.001 SOL de rent.'],
          ['`attest({ operatorKeypair, actionHash, actionType?, privacyMode? })`', '`{ txSignature, explorerUrl }`', '`actionHash` debe ser exactamente 32 bytes. Tipo default: `Transaction`.'],
          ['`batchAttest({ operatorKeypair, attestations })`', '`{ txSignature, explorerUrl }`', '1–100 entradas; lanza `BatchLimitExceededError` por encima de 100.'],
          ['`updatePolicyRoot({ operatorKeypair, newRoot })`', '`{ txSignature, explorerUrl }`', 'Rota la raíz Merkle de política de 32 bytes.'],
          ['`revokeAgent({ operatorKeypair })`', '`{ txSignature, explorerUrl }`', 'Kill switch irreversible. Un agente revocado no puede atestar.'],
        ],
      },
      { kind: 'h2', text: 'Leer estado on-chain' },
      { kind: 'code', code: readCode },
      { kind: 'h2', text: 'Cliente de la API REST' },
      {
        kind: 'p',
        text: '`ProvaApiClient` consulta la capa indexada — úsalo para dashboards, auditorías y flujos de verificación donde lees en vez de escribir.',
      },
      { kind: 'code', code: apiClientCode },
      { kind: 'h2', text: 'Manejo de errores' },
      { kind: 'code', code: errorCode },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Todos los métodos de escritura propagan los errores de transacción de Solana tal cual (p. ej. fondos insuficientes, blockhash expirado) para que reintentes con tu propia política.',
      },
    ],
  },
  ZH: {
    title: 'TypeScript SDK',
    intro:
      '`prova-agent-sdk` 的完整参考 — 该 npm 包通过 RPC 直接与 Anchor 程序通信（写入），并与 REST API 通信（读取）。Apache 2.0，无后端中介。',
    blocks: [
      { kind: 'h2', text: '安装与配置' },
      { kind: 'code', code: `npm install prova-agent-sdk` },
      { kind: 'code', title: 'ProvaClient 配置', code: configCode },
      {
        kind: 'table',
        headers: ['选项', '类型', '说明'],
        rows: [
          ['`rpcUrl`', '`string`', 'Solana RPC 端点（devnet/mainnet）。推荐 Helius。'],
          ['`agentKeypair`', '`Keypair`', '代理身份。通过 Ed25519 在链下为每个 `action_hash` 签名。'],
          ['`programId?`', '`string`', 'Prova 程序 ID。默认为 Devnet 部署（`G11d…`）。'],
        ],
      },
      { kind: 'h2', text: '哈希操作' },
      { kind: 'code', code: hashCode },
      {
        kind: 'p',
        text: '对您愿意展示给审计方的确切结构化负载进行哈希。确定性是关键：相同的负载总是产生相同的哈希，使收据可被独立重新计算。',
      },
      { kind: 'h2', text: '链上生命周期' },
      { kind: 'code', code: lifecycleCode },
      {
        kind: 'table',
        headers: ['方法', '返回值', '备注'],
        rows: [
          ['`registerAgent({ operatorKeypair, policyRoot? })`', '`{ txSignature, agentPda, explorerUrl }`', '创建代理 PDA。每个操作员一个；租金约 0.001 SOL。'],
          ['`attest({ operatorKeypair, actionHash, actionType?, privacyMode? })`', '`{ txSignature, explorerUrl }`', '`actionHash` 必须恰好 32 字节。默认类型：`Transaction`。'],
          ['`batchAttest({ operatorKeypair, attestations })`', '`{ txSignature, explorerUrl }`', '1–100 条；超过 100 抛出 `BatchLimitExceededError`。'],
          ['`updatePolicyRoot({ operatorKeypair, newRoot })`', '`{ txSignature, explorerUrl }`', '轮换 32 字节策略 Merkle 根。'],
          ['`revokeAgent({ operatorKeypair })`', '`{ txSignature, explorerUrl }`', '不可逆的终止开关。被撤销的代理无法再证明。'],
        ],
      },
      { kind: 'h2', text: '读取链上状态' },
      { kind: 'code', code: readCode },
      { kind: 'h2', text: 'REST API 客户端' },
      {
        kind: 'p',
        text: '`ProvaApiClient` 查询索引层 — 用于仪表板、审计和只读的验证流程。',
      },
      { kind: 'code', code: apiClientCode },
      { kind: 'h2', text: '错误处理' },
      { kind: 'code', code: errorCode },
      {
        kind: 'callout',
        tone: 'info',
        text: '所有写入方法都会原样抛出 Solana 交易错误（如余额不足、blockhash 过期），以便您按自己的策略重试。',
      },
    ],
  },
};
