'use client';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Quick Start',
    headline: ['Five lines.', 'Verified on-chain.'],
    desc: 'Issue your first AI agent behavior attestation on Solana in under 2 minutes.',
    steps: [
      {
        step: '01',
        title: 'Install',
        code: `npm install prova-agent-sdk`,
      },
      {
        step: '02',
        title: 'Initialize the client',
        code: `import { ProvaClient } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL,   // Helius devnet recommended
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});`,
      },
      {
        step: '03',
        title: 'Issue an attestation',
        code: `// Hash any structured action payload — deterministic, collision-resistant
const actionHash = await ProvaClient.hashAction(
  JSON.stringify({ operation: 'transfer', amount: '500', token: 'USDC' })
);

const receipt = await client.attest({
  operatorKeypair,   // wallet that registered this agent
  actionHash,
  actionType: 'Transaction',
  privacyMode: false,
});

console.log('Receipt tx:', receipt.txSignature);
console.log('Explorer:  ', receipt.explorerUrl);`,
      },
      {
        step: '04',
        title: 'Batch-attest up to 100 actions in one tx',
        code: `// One Solana transaction → up to 100 receipts (ComputeBudget auto-scaled)
const batch = await client.batchAttest({
  operatorKeypair,
  attestations: [
    { actionHash: hash1, actionType: 'ToolCall' },
    { actionHash: hash2, actionType: 'Decision', privacyMode: true },
    { actionHash: hash3, actionType: 'ModelInvocation' },
  ],
});`,
      },
      {
        step: '05',
        title: 'Query via REST API',
        code: `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...',   // generate at /app/api-keys
});

const { data } = await api.listAttestations({ limit: 20 });`,
      },
      {
        step: '06',
        title: 'DeFi Agent — attest any on-chain protocol action',
        code: `// Pattern: wrap any protocol interaction in a Prova receipt.
// Works with Jupiter swaps, pump.fun buys, Orca LPs, or any Solana program.
// No modification to the protocol — Prova is a receipt layer on top.

// 1. Build the structured payload for the action your agent just performed
const swapPayload = {
  protocol:    'jupiter',
  operation:   'exactInSwap',
  inputMint:   'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  outputMint:  'So11111111111111111111111111111111111111112',   // SOL
  inputAmount: '100000000',  // 100 USDC (6 decimals)
  slippageBps: 50,
  routePlan:   ['Orca', 'Raydium'],
  agentId:     operatorKeypair.publicKey.toBase58(),
  timestamp:   Date.now(),
};

// 2. Hash the payload — same hash every time for the same action params
const actionHash = await ProvaClient.hashAction(JSON.stringify(swapPayload));

// 3. Attest — one Ed25519 proof sealed on Solana
const receipt = await client.attest({
  operatorKeypair,
  actionHash,
  actionType: 'Transaction',
  privacyMode: false,   // set true for Vanish mode (hash on-chain, payload off-chain)
});

// → Auditors, regulators, and users can now verify what your agent swapped,
//   when, and with which parameters — without trusting your logs.
console.log('DeFi receipt:', receipt.explorerUrl);`,
      },
    ],
    onchainTitle: 'What lands on-chain',
    onchainDesc: 'Each attest() call creates a BehaviorAttestation account on Solana via the Anchor program. It stores the action hash, type, Ed25519 signature, and timestamp — SAS-compatible and verifiable by anyone. Share the tx signature as a Solana Blink to make it visible in any compatible wallet or Twitter/X client.',
    apiTitle: 'REST API base URL',
    blinkTitle: 'Share as a Solana Blink',
    blinkCode: `// After attestation, make the receipt shareable as a Blink:
const blinkUrl =
  \`https://prova-solana.vercel.app/api/actions/verify?tx=\${receipt.txSignature}\`;

// Paste this URL in Twitter/X to render the receipt as an interactive card.
// Supported by Phantom, Backpack, Solflare, and all Dialect-compatible clients.
console.log('Blink:', blinkUrl);`,
  },
  ES: {
    tag: 'Inicio Rápido',
    headline: ['Cinco líneas.', 'Verificado on-chain.'],
    desc: 'Emite la primera atestación de comportamiento de tu agente de IA en Solana en menos de 2 minutos.',
    steps: [
      {
        step: '01',
        title: 'Instalar',
        code: `npm install prova-agent-sdk`,
      },
      {
        step: '02',
        title: 'Inicializar el cliente',
        code: `import { ProvaClient } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL,
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});`,
      },
      {
        step: '03',
        title: 'Emitir una atestación',
        code: `const actionHash = await ProvaClient.hashAction(
  JSON.stringify({ operation: 'transfer', amount: '500', token: 'USDC' })
);

const receipt = await client.attest({
  operatorKeypair,
  actionHash,
  actionType: 'Transaction',
  privacyMode: false,
});

console.log('Recibo tx:', receipt.txSignature);`,
      },
      {
        step: '04',
        title: 'Batch: hasta 100 atestaciones en 1 tx',
        code: `const batch = await client.batchAttest({
  operatorKeypair,
  attestations: [
    { actionHash: hash1, actionType: 'ToolCall' },
    { actionHash: hash2, actionType: 'Decision', privacyMode: true },
    { actionHash: hash3, actionType: 'ModelInvocation' },
  ],
});`,
      },
      {
        step: '05',
        title: 'Consultar mediante la API REST',
        code: `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...',   // genera en /app/api-keys
});

const { data } = await api.listAttestations({ limit: 20 });`,
      },
      {
        step: '06',
        title: 'Agente DeFi — atestar cualquier acción on-chain',
        code: `// Patrón: envuelve cualquier interacción con un protocolo en un recibo Prova.
// Compatible con Jupiter, pump.fun, Orca, Raydium — sin modificar el protocolo.

const swapPayload = {
  protocol:    'jupiter',
  operation:   'exactInSwap',
  inputMint:   'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  outputMint:  'So11111111111111111111111111111111111111112',   // SOL
  inputAmount: '100000000',
  slippageBps: 50,
  agentId:     operatorKeypair.publicKey.toBase58(),
  timestamp:   Date.now(),
};

const actionHash = await ProvaClient.hashAction(JSON.stringify(swapPayload));

const receipt = await client.attest({
  operatorKeypair,
  actionHash,
  actionType: 'Transaction',
  privacyMode: false,
});

// → Auditores, reguladores y usuarios pueden verificar qué swap hizo el agente,
//   cuándo y con qué parámetros — sin depender de tus logs.
console.log('Recibo DeFi:', receipt.explorerUrl);`,
      },
    ],
    onchainTitle: 'Qué queda on-chain',
    onchainDesc: 'Cada llamada a attest() crea una cuenta BehaviorAttestation en Solana a través del programa Anchor. Almacena el hash de la acción, tipo, firma Ed25519 y timestamp — compatible con SAS y verificable por cualquiera. Comparte la firma de tx como un Solana Blink.',
    apiTitle: 'URL base de la API REST',
    blinkTitle: 'Compartir como Solana Blink',
    blinkCode: `const blinkUrl =
  \`https://prova-solana.vercel.app/api/actions/verify?tx=\${receipt.txSignature}\`;

// Pega esta URL en Twitter/X para mostrar el recibo como tarjeta interactiva.
console.log('Blink:', blinkUrl);`,
  },
  ZH: {
    tag: '快速入门',
    headline: ['五行代码。', '链上验证。'],
    desc: '在不到 2 分钟的时间内，在 Solana 上发出您的首个 AI 代理行为证明。',
    steps: [
      {
        step: '01',
        title: '安装',
        code: `npm install prova-agent-sdk`,
      },
      {
        step: '02',
        title: '初始化客户端',
        code: `import { ProvaClient } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL,
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});`,
      },
      {
        step: '03',
        title: '发出证明',
        code: `const actionHash = await ProvaClient.hashAction(
  JSON.stringify({ operation: 'transfer', amount: '500', token: 'USDC' })
);

const receipt = await client.attest({
  operatorKeypair,
  actionHash,
  actionType: 'Transaction',
  privacyMode: false,
});

console.log('收据 tx:', receipt.txSignature);`,
      },
      {
        step: '04',
        title: '批量证明：一笔交易最多 100 条',
        code: `const batch = await client.batchAttest({
  operatorKeypair,
  attestations: [
    { actionHash: hash1, actionType: 'ToolCall' },
    { actionHash: hash2, actionType: 'Decision', privacyMode: true },
    { actionHash: hash3, actionType: 'ModelInvocation' },
  ],
});`,
      },
      {
        step: '05',
        title: '通过 REST API 查询',
        code: `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...',
});

const { data } = await api.listAttestations({ limit: 20 });`,
      },
      {
        step: '06',
        title: 'DeFi 代理 — 证明任何链上操作',
        code: `// 模式：将任何协议交互封装在 Prova 收据中。
// 兼容 Jupiter、pump.fun、Orca — 无需修改协议。

const swapPayload = {
  protocol:    'jupiter',
  operation:   'exactInSwap',
  inputMint:   'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  outputMint:  'So11111111111111111111111111111111111111112',
  inputAmount: '100000000',
  agentId:     operatorKeypair.publicKey.toBase58(),
  timestamp:   Date.now(),
};

const actionHash = await ProvaClient.hashAction(JSON.stringify(swapPayload));
const receipt = await client.attest({ operatorKeypair, actionHash, actionType: 'Transaction' });

console.log('DeFi 收据:', receipt.explorerUrl);`,
      },
    ],
    onchainTitle: '链上存储的内容',
    onchainDesc: '每次调用 attest() 都会通过 Anchor 程序在 Solana 上创建一个 BehaviorAttestation 账户，存储操作哈希、类型、Ed25519 签名和时间戳。',
    apiTitle: 'REST API 基础 URL',
    blinkTitle: '以 Solana Blink 形式分享',
    blinkCode: `const blinkUrl =
  \`https://prova-solana.vercel.app/api/actions/verify?tx=\${receipt.txSignature}\`;
console.log('Blink:', blinkUrl);`,
  },
};

export function QuickStartContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">{t.headline[0]}</span>
              <span className="mt-1 block text-muted-foreground">{t.headline[1]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.desc}</p>
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {t.steps.map((s) => (
            <li
              key={s.step}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-[auto_1fr] lg:gap-16 lg:py-12"
            >
              <span className="font-mono text-xs text-primary">{s.step}</span>
              <div>
                <h2 className="font-display text-base uppercase text-foreground lg:text-lg">{s.title}</h2>
                <div className="mt-4 overflow-x-auto border border-border bg-surface p-5">
                  <pre className="font-mono text-sm leading-relaxed text-primary/90">{s.code}</pre>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-px bg-border md:grid-cols-2">
          <div className="bg-background p-8">
            <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.onchainTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.onchainDesc}</p>
          </div>
          <div className="bg-background p-8">
            <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.apiTitle}</p>
            <a
              href="https://prova-api.fly.dev/api/v1/health"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 flex items-center gap-1.5 font-mono text-sm text-foreground hover:text-primary"
            >
              https://prova-api.fly.dev
              <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
            </a>
            <p className="mt-2 font-mono text-xs text-muted-foreground">GET /api/v1/attestations</p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">GET /api/v1/agents/:id</p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">GET /api/v1/health</p>
          </div>
        </div>

        {/* Blink sharing */}
        <div className="mt-6 border border-border bg-background p-8">
          <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.blinkTitle}</p>
          <div className="mt-4 overflow-x-auto border border-border bg-surface p-5">
            <pre className="font-mono text-sm leading-relaxed text-primary/90">{t.blinkCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
