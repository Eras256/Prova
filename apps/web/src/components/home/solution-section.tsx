'use client';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'The fix',
    headline: ['One signed receipt', 'for every', 'action.'],
    description: 'Prova issues behavior attestations through the Solana Attestation Service — the same Foundation-backed primitive used for on-chain identity. You get a forensic trail that survives audits, lawsuits, and the next AI policy update.',
    features: [
      {
        icon: Shield,
        title: 'Signed by the agent that did the work',
        description: 'Every attestation carries an Ed25519 signature from the agent key. No shared secrets. No impersonation.',
      },
      {
        icon: Lock,
        title: 'Immutable the moment it lands',
        description: 'Once on Solana, the receipt cannot be altered, deleted, or backdated. Not by you. Not by us.',
      },
      {
        icon: CheckCircle2,
        title: 'Verifiable without trusting Prova',
        description: 'Counterparties, regulators, and your own legal team verify any attestation directly on-chain.',
      },
    ],
    lines: '9 lines',
    footer: 'No queue · No batching · No servers to run'
  },
  ES: {
    sectionTitle: 'La solución',
    headline: ['Un recibo firmado', 'por cada', 'acción.'],
    description: 'Prova emite atestaciones de comportamiento a través del Solana Attestation Service — la misma primitiva respaldada por la Fundación que se usa para identidad on-chain. Obtienes un rastro forense que sobrevive a auditorías, demandas y la próxima actualización de la política de IA.',
    features: [
      {
        icon: Shield,
        title: 'Firmado por el agente que hizo el trabajo',
        description: 'Cada atestación lleva una firma Ed25519 de la clave del agente. Sin secretos compartidos. Sin suplantaciones.',
      },
      {
        icon: Lock,
        title: 'Inmutable en el momento en que aterriza',
        description: 'Una vez en Solana, el recibo no puede ser alterado, borrado ni fechado con retroactividad. Ni por ti. Ni por nosotros.',
      },
      {
        icon: CheckCircle2,
        title: 'Verificable sin confiar en Prova',
        description: 'Contrapartes, reguladores y tu propio equipo legal verifican cualquier atestación directamente on-chain.',
      },
    ],
    lines: '9 líneas',
    footer: 'Sin colas · Sin agrupamiento · Sin servidores que gestionar'
  },
  ZH: {
    sectionTitle: '解决方案',
    headline: ['为每一项', '操作提供', '一个签名收据。'],
    description: 'Prova 通过 Solana Attestation Service 发布行为证明 —— 这是与链上身份使用的相同的基金会支持的基础协议。你将获得一份能够经受住审计、诉讼和下一次AI政策更新考验的法证轨迹。',
    features: [
      {
        icon: Shield,
        title: '由执行工作的代理签名',
        description: '每份证明都带有代理密钥的 Ed25519 签名。没有共享秘密。没有伪造冒充。',
      },
      {
        icon: Lock,
        title: '一经上链，不可篡改',
        description: '一旦登录 Solana，收据将无法被篡改、删除或倒填日期。你不能，我们也不能。',
      },
      {
        icon: CheckCircle2,
        title: '无需信任 Prova 即可验证',
        description: '交易对手、监管机构和你自己的法律团队都可以直接在链上验证任何证明。',
      },
    ],
    lines: '9 行',
    footer: '无需排队 · 无需批处理 · 无需运行服务器'
  }
};

const CODE = `import { ProvaClient, AttestationBuilder } from '@prova/sdk';

const client = new ProvaClient({ rpcUrl, agentKeypair });

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Attested:', receipt.id);
// → att_4Kf9...x2pQ — on-chain PDA, globally verifiable`;

export function SolutionSection() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.sectionTitle}</p>
            <h2 className="mt-3 font-display text-2xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="block">{t.headline[1]}</span>
              <span className="block bg-primary px-2 text-primary-foreground">{t.headline[2]}</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.description}
            </p>

            <div className="mt-10 space-y-7 border-t border-border pt-8">
              {t.features.map((f) => (
                <div key={f.title} className="grid grid-cols-[auto_1fr] gap-5">
                  <f.icon className="mt-1 h-4 w-4 text-primary" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-foreground">{f.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">attest.ts</span>
                <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.lines}</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-foreground/90">
                <code>{CODE}</code>
              </pre>
            </div>
            <p className="mt-4 font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
              {t.footer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
