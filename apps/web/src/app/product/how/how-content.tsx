'use client';
import { Network } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Product',
    title: 'How It Works',
    desc: 'Prova is a thin cryptographic layer that sits between your AI agent and the Solana blockchain, acting as a forensic witness to every agentic action.',
    architectureLabel: 'Architecture',
    steps: [
      { n: '01', t: 'Agent Intent', d: 'Your agent decides to execute an action (e.g., a DeFi swap or a tool call).' },
      { n: '02', t: 'Payload Hashing', d: 'The SDK deterministically hashes the JSON payload of the action.' },
      { n: '03', t: 'Ed25519 Signing', d: 'The agent uses its private key to cryptographically sign the hash.' },
      { n: '04', t: 'On-chain Settlement', d: 'The signature is sealed into a Solana PDA, making it immutable and timestamped.' },
    ],
  },
  ES: {
    tag: 'Producto',
    title: 'Cómo Funciona',
    desc: 'Prova es una capa criptográfica ligera que se sitúa entre tu agente de IA y la blockchain de Solana, actuando como testigo forense de cada acción autónoma.',
    architectureLabel: 'Arquitectura',
    steps: [
      { n: '01', t: 'Intención del Agente', d: 'Tu agente decide ejecutar una acción (ej. un swap DeFi o una llamada a herramienta).' },
      { n: '02', t: 'Hashing del Payload', d: 'El SDK hashea de forma determinista el payload JSON de la acción.' },
      { n: '03', t: 'Firma Ed25519', d: 'El agente usa su llave privada para firmar criptográficamente el hash.' },
      { n: '04', t: 'Liquidación On-chain', d: 'La firma se sella en un PDA de Solana, haciéndola inmutable y con marca de tiempo.' },
    ],
  },
  ZH: {
    tag: '产品',
    title: '工作原理',
    desc: 'Prova 位于您的 AI 代理和 Solana 区块链之间，是一个轻量级的密码学层，充当每个代理操作的法证见证人。',
    architectureLabel: '架构',
    steps: [
      { n: '01', t: '代理意图', d: '您的代理决定执行一项操作（例如 DeFi 交换或工具调用）。' },
      { n: '02', t: '负载哈希', d: 'SDK 对操作的 JSON 负载进行确定性哈希。' },
      { n: '03', t: 'Ed25519 签名', d: '代理使用其私钥对哈希进行密码学签名。' },
      { n: '04', t: '链上结算', d: '签名被密封到 Solana PDA 中，使其不可变且带有时间戳。' },
    ],
  },
};

export function HowContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <Network className="mb-4 h-10 w-10 text-primary" strokeWidth={1.5} />
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.architectureLabel}</p>
          </div>
          <div className="space-y-px border border-border">
            {t.steps.map((s) => (
              <div key={s.n} className="border-b border-border bg-surface px-5 py-4 flex gap-4 items-start last:border-b-0">
                <span className="font-mono text-sm text-primary">{s.n}</span>
                <div>
                  <p className="font-pixel text-[11px] uppercase tracking-wider text-foreground">{s.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
