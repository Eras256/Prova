import type { LocalizedDoc } from './types';

const installCode = `npm install prova-agent-sdk`;

const keypairCode = `import { Keypair } from '@solana/web3.js';

// Agent keypair: signs each action hash (Ed25519, off-chain).
// Operator keypair: owns the agent PDA, pays fees, signs transactions.
const agentKeypair = Keypair.fromSecretKey(agentSecretKey);
const operatorKeypair = Keypair.fromSecretKey(operatorSecretKey);`;

const clientCode = `import { ProvaClient } from 'prova-agent-sdk';

const client = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL!, // Helius devnet recommended
  agentKeypair,
});`;

const registerCode = `const registration = await client.registerAgent({
  operatorKeypair,
  // policyRoot?: Uint8Array — optional 32-byte Merkle root of your policy
});

console.log('Agent PDA:', registration.agentPda.toBase58());
console.log('Explorer :', registration.explorerUrl);`;

const attestCode = `const actionHash = await ProvaClient.hashAction(
  JSON.stringify({ operation: 'transfer', amount: '500', token: 'USDC' })
);

const receipt = await client.attest({
  operatorKeypair,
  actionHash,                 // 32 bytes, SHA-256
  actionType: 'Transaction',  // default: 'Transaction'
  privacyMode: false,         // true → hash on-chain, payload stays off-chain
});

console.log('Receipt tx:', receipt.txSignature);
console.log('Explorer  :', receipt.explorerUrl);`;

const batchCode = `// Up to 100 attestations in ONE Solana transaction.
const batch = await client.batchAttest({
  operatorKeypair,
  attestations: [
    { actionHash: hash1, actionType: 'ToolCall' },
    { actionHash: hash2, actionType: 'Decision', privacyMode: true },
    { actionHash: hash3, actionType: 'ModelInvocation' },
  ],
});`;

const verifyCode = `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({ apiUrl: 'https://prova-api.fly.dev' });

const { data } = await api.listAttestations({
  agentPda: registration.agentPda.toBase58(),
  limit: 20,
});`;

export const gettingStarted: LocalizedDoc = {
  EN: {
    title: 'Getting Started',
    intro:
      'From npm install to a verified on-chain receipt in under five minutes. This guide walks through registering an agent and issuing your first attestations on Solana Devnet.',
    blocks: [
      { kind: 'h2', text: 'Prerequisites' },
      {
        kind: 'list',
        items: [
          'Node.js 18 or newer.',
          'A Solana RPC endpoint (Helius Devnet is recommended for stability).',
          'A Devnet wallet with some SOL for fees — get it free with `solana airdrop 2` or at `faucet.solana.com`.',
        ],
      },
      { kind: 'h2', text: '1. Install the SDK' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: '2. Prepare your keypairs' },
      {
        kind: 'p',
        text: 'Prova separates two identities: the agent (the AI that acts and signs each action hash) and the operator (the wallet accountable for it — it owns the on-chain account and pays transaction fees).',
      },
      { kind: 'code', code: keypairCode },
      {
        kind: 'callout',
        tone: 'warn',
        text: 'Never hardcode or commit secret keys. Load them from environment variables or a secret manager.',
      },
      { kind: 'h2', text: '3. Initialize the client' },
      { kind: 'code', code: clientCode },
      { kind: 'h2', text: '4. Register your agent' },
      {
        kind: 'p',
        text: 'Registration creates the agent account (a PDA derived from the operator public key) on-chain. It is a one-time step per operator, costing only rent exemption (~0.001 SOL).',
      },
      { kind: 'code', code: registerCode },
      { kind: 'h2', text: '5. Issue your first attestation' },
      {
        kind: 'p',
        text: 'Hash any structured payload describing the action, then seal it. The hash is deterministic: the same action always produces the same hash, so third parties can recompute and verify it.',
      },
      { kind: 'code', code: attestCode },
      { kind: 'h2', text: '6. Batch high-frequency actions' },
      {
        kind: 'p',
        text: 'Agents that act frequently should batch. One transaction carries up to 100 attestations, dividing the cost per receipt accordingly.',
      },
      { kind: 'code', code: batchCode },
      { kind: 'h2', text: '7. Verify it' },
      {
        kind: 'list',
        items: [
          'Open the `explorerUrl` from the receipt to see the transaction on Solana Explorer.',
          'Search your agent PDA in the Prova Explorer at `theprova.xyz/explorer` for the live, human-readable view.',
          'Or query the REST API directly:',
        ],
      },
      { kind: 'code', code: verifyCode },
      { kind: 'h2', text: 'Next steps' },
      {
        kind: 'list',
        items: [
          'Using Solana Agent Kit? The Agent Kit Adapter attests every action automatically — no manual `attest()` calls.',
          'Read Core Concepts to understand what exactly lands on-chain and how privacy mode works.',
          'Building in Rust? See the Rust SDK page.',
        ],
      },
    ],
  },
  ES: {
    title: 'Primeros pasos',
    intro:
      'De npm install a un recibo on-chain verificado en menos de cinco minutos. Esta guía cubre el registro de un agente y la emisión de tus primeras atestaciones en Solana Devnet.',
    blocks: [
      { kind: 'h2', text: 'Requisitos' },
      {
        kind: 'list',
        items: [
          'Node.js 18 o superior.',
          'Un endpoint RPC de Solana (se recomienda Helius Devnet por estabilidad).',
          'Una wallet en Devnet con algo de SOL para fees — consíguelo gratis con `solana airdrop 2` o en `faucet.solana.com`.',
        ],
      },
      { kind: 'h2', text: '1. Instala el SDK' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: '2. Prepara tus keypairs' },
      {
        kind: 'p',
        text: 'Prova separa dos identidades: el agente (la IA que actúa y firma cada hash de acción) y el operador (la wallet responsable — es dueña de la cuenta on-chain y paga los fees de transacción).',
      },
      { kind: 'code', code: keypairCode },
      {
        kind: 'callout',
        tone: 'warn',
        text: 'Nunca hardcodees ni commitees claves secretas. Cárgalas desde variables de entorno o un gestor de secretos.',
      },
      { kind: 'h2', text: '3. Inicializa el cliente' },
      { kind: 'code', code: clientCode },
      { kind: 'h2', text: '4. Registra tu agente' },
      {
        kind: 'p',
        text: 'El registro crea la cuenta del agente (una PDA derivada de la clave pública del operador) on-chain. Es un paso único por operador, con costo de solo la exención de renta (~0.001 SOL).',
      },
      { kind: 'code', code: registerCode },
      { kind: 'h2', text: '5. Emite tu primera atestación' },
      {
        kind: 'p',
        text: 'Hashea cualquier payload estructurado que describa la acción y séllalo. El hash es determinista: la misma acción produce siempre el mismo hash, así que terceros pueden recomputarlo y verificarlo.',
      },
      { kind: 'code', code: attestCode },
      { kind: 'h2', text: '6. Agrupa acciones de alta frecuencia' },
      {
        kind: 'p',
        text: 'Los agentes que actúan con frecuencia deben agrupar. Una transacción lleva hasta 100 atestaciones, dividiendo el costo por recibo en consecuencia.',
      },
      { kind: 'code', code: batchCode },
      { kind: 'h2', text: '7. Verifícalo' },
      {
        kind: 'list',
        items: [
          'Abre el `explorerUrl` del recibo para ver la transacción en Solana Explorer.',
          'Busca la PDA de tu agente en el Prova Explorer en `theprova.xyz/explorer` para la vista en vivo y legible.',
          'O consulta la API REST directamente:',
        ],
      },
      { kind: 'code', code: verifyCode },
      { kind: 'h2', text: 'Siguientes pasos' },
      {
        kind: 'list',
        items: [
          '¿Usas Solana Agent Kit? El Adapter Agent Kit atesta cada acción automáticamente — sin llamadas manuales a `attest()`.',
          'Lee Conceptos clave para entender qué queda exactamente on-chain y cómo funciona el privacy mode.',
          '¿Construyes en Rust? Mira la página del SDK Rust.',
        ],
      },
    ],
  },
  ZH: {
    title: '快速上手',
    intro:
      '从 npm install 到经过验证的链上收据，只需不到五分钟。本指南介绍如何在 Solana Devnet 上注册代理并发出您的第一批证明。',
    blocks: [
      { kind: 'h2', text: '前置条件' },
      {
        kind: 'list',
        items: [
          'Node.js 18 或更高版本。',
          '一个 Solana RPC 端点（推荐 Helius Devnet，更稳定）。',
          '一个有少量 SOL 的 Devnet 钱包 — 可通过 `solana airdrop 2` 或 `faucet.solana.com` 免费获取。',
        ],
      },
      { kind: 'h2', text: '1. 安装 SDK' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: '2. 准备密钥对' },
      {
        kind: 'p',
        text: 'Prova 区分两个身份：代理（执行操作并为每个操作哈希签名的 AI）和操作员（为其负责的钱包 — 拥有链上账户并支付交易费用）。',
      },
      { kind: 'code', code: keypairCode },
      {
        kind: 'callout',
        tone: 'warn',
        text: '切勿硬编码或提交私钥。请从环境变量或密钥管理器加载。',
      },
      { kind: 'h2', text: '3. 初始化客户端' },
      { kind: 'code', code: clientCode },
      { kind: 'h2', text: '4. 注册代理' },
      {
        kind: 'p',
        text: '注册会在链上创建代理账户（由操作员公钥派生的 PDA）。每个操作员只需一次，成本仅为租金豁免（约 0.001 SOL）。',
      },
      { kind: 'code', code: registerCode },
      { kind: 'h2', text: '5. 发出第一条证明' },
      {
        kind: 'p',
        text: '对描述操作的任意结构化负载进行哈希，然后封存。哈希是确定性的：相同的操作总是产生相同的哈希，因此第三方可以重新计算并验证。',
      },
      { kind: 'code', code: attestCode },
      { kind: 'h2', text: '6. 批量处理高频操作' },
      {
        kind: 'p',
        text: '频繁行动的代理应使用批量证明。一笔交易最多可承载 100 条证明，单张收据的成本相应降低。',
      },
      { kind: 'code', code: batchCode },
      { kind: 'h2', text: '7. 验证' },
      {
        kind: 'list',
        items: [
          '打开收据中的 `explorerUrl`，在 Solana Explorer 上查看交易。',
          '在 `theprova.xyz/explorer` 的 Prova Explorer 中搜索您的代理 PDA，获得实时、可读的视图。',
          '或直接查询 REST API：',
        ],
      },
      { kind: 'code', code: verifyCode },
      { kind: 'h2', text: '下一步' },
      {
        kind: 'list',
        items: [
          '在用 Solana Agent Kit？Agent Kit 适配器会自动证明每个操作 — 无需手动调用 `attest()`。',
          '阅读核心概念，了解链上到底存储什么以及隐私模式的工作方式。',
          '用 Rust 构建？请参阅 Rust SDK 页面。',
        ],
      },
    ],
  },
};
