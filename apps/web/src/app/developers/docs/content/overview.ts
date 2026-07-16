import type { LocalizedDoc } from './types';

// Bloques de código compartidos entre idiomas.
const installCode = `npm install prova-agent-sdk`;

const fiveLines = `import { ProvaClient } from 'prova-agent-sdk';

const client = new ProvaClient({ rpcUrl, agentKeypair });
const actionHash = await ProvaClient.hashAction(JSON.stringify(action));
const receipt = await client.attest({ operatorKeypair, actionHash });
console.log(receipt.explorerUrl); // sealed on Solana ✓`;

export const overview: LocalizedDoc = {
  EN: {
    title: 'Prova Documentation',
    intro:
      'Prova is a cryptographic attestation layer for AI agent behavior on Solana. Every action your agent performs — a swap, a tool call, an autonomous decision — is sealed on-chain as an immutable, independently verifiable receipt.',
    blocks: [
      { kind: 'h2', text: 'Why Prova' },
      {
        kind: 'p',
        text: 'AI agents operate as black boxes. Operator logs can be edited, deleted, or never written at all. Prova gives every agent action a tamper-proof, Ed25519-signed receipt on Solana — think `git blame` for AI agents.',
      },
      {
        kind: 'list',
        items: [
          'Verifiable: anyone can check a receipt on Solana without trusting your infrastructure.',
          'Cheap and fast: up to 100 attestations batched into a single transaction, sealed in under a second.',
          'Non-custodial: Prova never holds keys or funds. Your agent signs locally.',
          'Open source: SDKs and the on-chain program are Apache 2.0.',
        ],
      },
      { kind: 'h2', text: 'How it works' },
      {
        kind: 'list',
        items: [
          '1. Hash — the agent hashes the action payload locally (SHA-256). Raw payloads never touch the chain.',
          '2. Sign — the agent keypair signs the hash with Ed25519. The signature is verified natively by the Solana runtime.',
          '3. Seal — the Anchor program records the attestation and emits an `AttestationIssued` event, permanently anchored in the transaction.',
        ],
      },
      { kind: 'code', title: 'Five lines to your first receipt', code: fiveLines },
      { kind: 'h2', text: 'The stack' },
      {
        kind: 'table',
        headers: ['Component', 'What it does'],
        rows: [
          ['`prova-agent-sdk` (npm)', 'TypeScript SDK — register agents, issue and batch attestations, query the REST API.'],
          ['`prova-agent-kit` (npm)', 'Drop-in adapter for Solana Agent Kit v2 — attests every agent action automatically.'],
          ['`prova-agent-sdk` (crates.io)', 'Rust SDK with a fluent attestation builder.'],
          ['Anchor program', 'On-chain verification (Ed25519) and event emission on Solana Devnet.'],
          ['REST API', 'Indexed, queryable attestation data at `prova-api.fly.dev`.'],
          ['Forensic Explorer', 'In-browser verification of any agent or receipt at `theprova.xyz/explorer`.'],
        ],
      },
      { kind: 'h2', text: 'Where to go next' },
      {
        kind: 'list',
        items: [
          'Getting Started — register an agent and issue your first attestation in minutes.',
          'Core Concepts — the attestation lifecycle, the agent/operator model, and the storage model.',
          'TypeScript SDK — full `ProvaClient`, `AttestationBuilder`, and `ProvaApiClient` reference.',
          'REST API — every endpoint, auth model, and rate limits.',
        ],
      },
      { kind: 'code', title: 'Install', code: installCode },
    ],
  },
  ES: {
    title: 'Documentación de Prova',
    intro:
      'Prova es una capa de atestación criptográfica del comportamiento de agentes de IA sobre Solana. Cada acción que ejecuta tu agente — un swap, un tool call, una decisión autónoma — queda sellada on-chain como un recibo inmutable y verificable de forma independiente.',
    blocks: [
      { kind: 'h2', text: 'Por qué Prova' },
      {
        kind: 'p',
        text: 'Los agentes de IA operan como cajas negras. Los logs del operador pueden editarse, borrarse o nunca escribirse. Prova le da a cada acción un recibo a prueba de manipulación, firmado con Ed25519, en Solana — piensa en `git blame` para agentes de IA.',
      },
      {
        kind: 'list',
        items: [
          'Verificable: cualquiera puede comprobar un recibo en Solana sin confiar en tu infraestructura.',
          'Barato y rápido: hasta 100 atestaciones agrupadas en una sola transacción, selladas en menos de un segundo.',
          'Sin custodia: Prova nunca retiene claves ni fondos. Tu agente firma localmente.',
          'Código abierto: los SDKs y el programa on-chain son Apache 2.0.',
        ],
      },
      { kind: 'h2', text: 'Cómo funciona' },
      {
        kind: 'list',
        items: [
          '1. Hash — el agente hashea el payload de la acción localmente (SHA-256). El payload crudo nunca toca la cadena.',
          '2. Firma — la keypair del agente firma el hash con Ed25519. La firma la verifica nativamente el runtime de Solana.',
          '3. Sellado — el programa Anchor registra la atestación y emite un evento `AttestationIssued`, anclado permanentemente en la transacción.',
        ],
      },
      { kind: 'code', title: 'Cinco líneas hasta tu primer recibo', code: fiveLines },
      { kind: 'h2', text: 'El stack' },
      {
        kind: 'table',
        headers: ['Componente', 'Qué hace'],
        rows: [
          ['`prova-agent-sdk` (npm)', 'SDK TypeScript — registra agentes, emite y agrupa atestaciones, consulta la API REST.'],
          ['`prova-agent-kit` (npm)', 'Adapter drop-in para Solana Agent Kit v2 — atesta cada acción del agente automáticamente.'],
          ['`prova-agent-sdk` (crates.io)', 'SDK Rust con builder fluido de atestaciones.'],
          ['Programa Anchor', 'Verificación on-chain (Ed25519) y emisión de eventos en Solana Devnet.'],
          ['API REST', 'Datos de atestaciones indexados y consultables en `prova-api.fly.dev`.'],
          ['Forensic Explorer', 'Verificación en el navegador de cualquier agente o recibo en `theprova.xyz/explorer`.'],
        ],
      },
      { kind: 'h2', text: 'Siguientes pasos' },
      {
        kind: 'list',
        items: [
          'Primeros pasos — registra un agente y emite tu primera atestación en minutos.',
          'Conceptos clave — el ciclo de vida de la atestación, el modelo agente/operador y el modelo de almacenamiento.',
          'SDK TypeScript — referencia completa de `ProvaClient`, `AttestationBuilder` y `ProvaApiClient`.',
          'API REST — todos los endpoints, el modelo de auth y los límites de tasa.',
        ],
      },
      { kind: 'code', title: 'Instalar', code: installCode },
    ],
  },
  ZH: {
    title: 'Prova 文档',
    intro:
      'Prova 是 Solana 上 AI 代理行为的加密证明层。您的代理执行的每一个操作——swap、工具调用、自主决策——都会作为不可篡改、可独立验证的收据封存在链上。',
    blocks: [
      { kind: 'h2', text: '为什么选择 Prova' },
      {
        kind: 'p',
        text: 'AI 代理如同黑箱运行。操作员的日志可以被编辑、删除，或根本从未记录。Prova 为每个代理操作提供防篡改、Ed25519 签名的 Solana 链上收据——可以理解为 AI 代理的 `git blame`。',
      },
      {
        kind: 'list',
        items: [
          '可验证：任何人都可以在 Solana 上核验收据，无需信任您的基础设施。',
          '低成本且快速：最多 100 条证明打包进一笔交易，一秒内封存。',
          '非托管：Prova 从不持有密钥或资金。您的代理在本地签名。',
          '开源：SDK 和链上程序均为 Apache 2.0。',
        ],
      },
      { kind: 'h2', text: '工作原理' },
      {
        kind: 'list',
        items: [
          '1. 哈希 — 代理在本地对操作负载进行哈希（SHA-256）。原始负载永远不会上链。',
          '2. 签名 — 代理密钥对使用 Ed25519 对哈希签名。签名由 Solana 运行时原生验证。',
          '3. 封存 — Anchor 程序记录证明并发出 `AttestationIssued` 事件，永久锚定在交易中。',
        ],
      },
      { kind: 'code', title: '五行代码获得第一张收据', code: fiveLines },
      { kind: 'h2', text: '技术栈' },
      {
        kind: 'table',
        headers: ['组件', '功能'],
        rows: [
          ['`prova-agent-sdk` (npm)', 'TypeScript SDK — 注册代理、发出和批量证明、查询 REST API。'],
          ['`prova-agent-kit` (npm)', 'Solana Agent Kit v2 即插即用适配器 — 自动证明代理的每个操作。'],
          ['`prova-agent-sdk` (crates.io)', '带流式证明构建器的 Rust SDK。'],
          ['Anchor 程序', 'Solana Devnet 上的链上验证（Ed25519）与事件发射。'],
          ['REST API', '在 `prova-api.fly.dev` 上索引、可查询的证明数据。'],
          ['Forensic Explorer', '在 `theprova.xyz/explorer` 中于浏览器内验证任何代理或收据。'],
        ],
      },
      { kind: 'h2', text: '下一步' },
      {
        kind: 'list',
        items: [
          '快速上手 — 几分钟内注册代理并发出第一条证明。',
          '核心概念 — 证明生命周期、代理/操作员模型和存储模型。',
          'TypeScript SDK — `ProvaClient`、`AttestationBuilder` 和 `ProvaApiClient` 的完整参考。',
          'REST API — 所有端点、认证模型和速率限制。',
        ],
      },
      { kind: 'code', title: '安装', code: installCode },
    ],
  },
};
