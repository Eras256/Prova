'use client';
import { Badge } from '@prova/ui';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Developers',
    title: 'Quick Start',
    desc: 'Issue your first AI agent behavior attestation on Solana in under 2 minutes.',
    steps: [
      { step: 1, title: 'Install the SDK', code: `pnpm add @prova/sdk` },
      { step: 2, title: 'Initialize the client', code: `import { ProvaClient } from '@prova/sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: 'https://api.devnet.solana.com',
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});` },
      { step: 3, title: 'Issue your first attestation', code: `import { AttestationBuilder } from '@prova/sdk';

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Attested:', receipt.id);` },
      { step: 4, title: 'Verify from anywhere', code: `const result = await client.verify(receipt.id);
console.log('Valid:', result.valid); // true` },
    ],
    onchainTitle: 'What happens on-chain?',
    onchainDesc1: 'Each ',
    onchainCode1: 'attest()',
    onchainDesc2: ' call creates a ',
    onchainCode2: 'BehaviorAttestation',
    onchainDesc3: ' account on Solana via the Anchor program. The account stores the action hash, type, Ed25519 signature, and timestamp — SAS-compatible.',
  },
  ES: {
    tag: 'Desarrolladores',
    title: 'Inicio Rápido',
    desc: 'Emite la primera atestación de comportamiento de tu agente de IA en Solana en menos de 2 minutos.',
    steps: [
      { step: 1, title: 'Instalar el SDK', code: `pnpm add @prova/sdk` },
      { step: 2, title: 'Inicializar el cliente', code: `import { ProvaClient } from '@prova/sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: 'https://api.devnet.solana.com',
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});` },
      { step: 3, title: 'Emitir la primera atestación', code: `import { AttestationBuilder } from '@prova/sdk';

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Attested:', receipt.id);` },
      { step: 4, title: 'Verificar desde cualquier lugar', code: `const result = await client.verify(receipt.id);
console.log('Valid:', result.valid); // true` },
    ],
    onchainTitle: '¿Qué sucede on-chain?',
    onchainDesc1: 'Cada llamada a ',
    onchainCode1: 'attest()',
    onchainDesc2: ' crea una cuenta de ',
    onchainCode2: 'BehaviorAttestation',
    onchainDesc3: ' en Solana a través del programa Anchor. La cuenta almacena el hash de la acción, el tipo, la firma Ed25519 y la marca de tiempo — compatible con SAS.',
  },
  ZH: {
    tag: '开发者',
    title: '快速入门',
    desc: '在不到 2 分钟的时间内，在 Solana 上发出您的首个 AI 代理行为证明。',
    steps: [
      { step: 1, title: '安装 SDK', code: `pnpm add @prova/sdk` },
      { step: 2, title: '初始化客户端', code: `import { ProvaClient } from '@prova/sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: 'https://api.devnet.solana.com',
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});` },
      { step: 3, title: '发出您的第一个证明', code: `import { AttestationBuilder } from '@prova/sdk';

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Attested:', receipt.id);` },
      { step: 4, title: '在任何地方进行验证', code: `const result = await client.verify(receipt.id);
console.log('Valid:', result.valid); // true` },
    ],
    onchainTitle: '链上发生了什么？',
    onchainDesc1: '每次调用 ',
    onchainCode1: 'attest()',
    onchainDesc2: ' 都会通过 Anchor 程序在 Solana 上创建一个 ',
    onchainCode2: 'BehaviorAttestation',
    onchainDesc3: ' 账户。该账户存储操作哈希、类型、Ed25519 签名和时间戳——与 SAS 兼容。',
  }
};

export function QuickStartContent() {
  const { lang } = useI18n();
  const t = content[lang];
  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Badge variant="secondary" className="mb-4">{t.tag}</Badge>
        <h1 className="text-4xl font-bold text-white">{t.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t.desc}
        </p>
        <div className="mt-12 space-y-8">
          {t.steps.map((s) => (
            <div key={s.step} className="flex gap-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {s.step}
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-lg font-semibold text-white">{s.title}</h3>
                <div className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm text-green-400">
                  <pre>{s.code}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-xl border border-border bg-primary/5 p-6">
          <h3 className="font-semibold text-white">{t.onchainTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.onchainDesc1}<code className="text-primary">{t.onchainCode1}</code>{t.onchainDesc2}<code className="text-primary">{t.onchainCode2}</code>{t.onchainDesc3}
          </p>
        </div>
      </div>
    </div>
  );
}
