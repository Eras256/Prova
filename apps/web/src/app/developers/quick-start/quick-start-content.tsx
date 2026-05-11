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
  rpcUrl: process.env.SOLANA_RPC_URL,
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});`,
      },
      {
        step: '03',
        title: 'Issue an attestation',
        code: `import { AttestationBuilder } from 'prova-agent-sdk';

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Receipt:', receipt.id);`,
      },
      {
        step: '04',
        title: 'Verify from anywhere',
        code: `const result = await client.verify(receipt.id);
console.log(result.valid); // true`,
      },
      {
        step: '05',
        title: 'Query via REST API',
        code: `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...',          // optional for public endpoints
});

const { data } = await api.listAttestations({
  agentPda: receipt.id,
  limit: 20,
});`,
      },
    ],
    onchainTitle: 'What lands on-chain',
    onchainDesc: 'Each attest() call creates a BehaviorAttestation account on Solana via the Anchor program. It stores the action hash, type, Ed25519 signature, and timestamp — SAS-compatible and verifiable by anyone.',
    apiTitle: 'REST API base URL',
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
        code: `import { AttestationBuilder } from 'prova-agent-sdk';

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Recibo:', receipt.id);`,
      },
      {
        step: '04',
        title: 'Verificar desde cualquier lugar',
        code: `const result = await client.verify(receipt.id);
console.log(result.valid); // true`,
      },
      {
        step: '05',
        title: 'Consultar mediante la API REST',
        code: `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...',          // opcional para endpoints públicos
});

const { data } = await api.listAttestations({
  agentPda: receipt.id,
  limit: 20,
});`,
      },
    ],
    onchainTitle: 'Qué queda on-chain',
    onchainDesc: 'Cada llamada a attest() crea una cuenta BehaviorAttestation en Solana a través del programa Anchor. Almacena el hash de la acción, el tipo, la firma Ed25519 y la marca de tiempo — compatible con SAS y verificable por cualquiera.',
    apiTitle: 'URL base de la API REST',
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
        code: `import { AttestationBuilder } from 'prova-agent-sdk';

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('收据：', receipt.id);`,
      },
      {
        step: '04',
        title: '在任何地方验证',
        code: `const result = await client.verify(receipt.id);
console.log(result.valid); // true`,
      },
      {
        step: '05',
        title: '通过 REST API 查询',
        code: `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...',          // 公共接口可选
});

const { data } = await api.listAttestations({
  agentPda: receipt.id,
  limit: 20,
});`,
      },
    ],
    onchainTitle: '链上存储的内容',
    onchainDesc: '每次调用 attest() 都会通过 Anchor 程序在 Solana 上创建一个 BehaviorAttestation 账户。该账户存储操作哈希、类型、Ed25519 签名和时间戳——与 SAS 兼容，任何人均可验证。',
    apiTitle: 'REST API 基础 URL',
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
      </div>
    </div>
  );
}
