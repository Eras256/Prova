'use client';

import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'About',
    headline: ['The forensic layer', 'the agentic economy', 'was missing.'],
    p1: 'Prova was founded in 2026 with a single conviction: the agentic economy cannot function without forensic accountability. As AI agents began handling real financial decisions on Solana, we saw a critical gap — thousands of agents acting, but no tamper-proof record of what they did.',
    p2: 'We built Prova as the missing layer. Not another identity protocol, not another reputation registry — but a behavior attestation layer that captures',
    p2em: 'what agents actually do',
    p2b: ', signed by their keys, anchored on-chain, independently verifiable.',
    p3: 'Prova is open source (Apache 2.0), non-custodial, and runs on its own Anchor program on Solana with native Ed25519 verification. We exist to make the agentic internet trustworthy.',
    quote: '"Every agent action deserves a cryptographic receipt."',
    disclaimerLabel: 'Legal disclaimer:',
    disclaimer: 'Prova is an independent software project and is NOT affiliated with, endorsed by, or sponsored by the Solana Foundation. Solana® is a registered trademark of the Solana Foundation. Prova does not custody user funds or provide financial advice.',
  },
  ES: {
    tag: 'Acerca de',
    headline: ['La capa forense', 'que le faltaba', 'a la economía de agentes.'],
    p1: 'Prova fue fundada en 2026 con una convicción: la economía de agentes no puede funcionar sin rendición de cuentas forense. Cuando los agentes de IA comenzaron a manejar decisiones financieras reales en Solana, vimos una brecha crítica — miles de agentes actuando, pero ningún registro inalterable de lo que hacían.',
    p2: 'Construimos Prova como la capa faltante. No otro protocolo de identidad, no otro registro de reputación — sino una capa de atestación de comportamiento que captura',
    p2em: 'lo que los agentes realmente hacen',
    p2b: ', firmado por sus claves, anclado on-chain, verificable de forma independiente.',
    p3: 'Prova es código abierto (Apache 2.0), sin custodia, y corre sobre su propio programa Anchor en Solana con verificación Ed25519 nativa. Existimos para hacer confiable el internet de agentes.',
    quote: '"Cada acción de un agente merece un recibo criptográfico."',
    disclaimerLabel: 'Aviso legal:',
    disclaimer: 'Prova es un proyecto de software independiente y NO está afiliado, respaldado ni patrocinado por la Solana Foundation. Solana® es una marca registrada de la Solana Foundation. Prova no custodia fondos de usuarios ni proporciona asesoramiento financiero.',
  },
  ZH: {
    tag: '关于我们',
    headline: ['代理经济', '所缺少的', '法证层。'],
    p1: 'Prova 创立于 2026 年，秉持一个信念：没有法证问责制，代理经济就无法运转。当 AI 代理开始在 Solana 上处理真实的金融决策时，我们发现了一个关键缺口——数千个代理在行动，却没有任何防篡改的记录。',
    p2: '我们将 Prova 构建为这一缺失的层。不是另一个身份协议，不是另一个声誉注册表——而是一个行为证明层，用于捕获',
    p2em: '代理实际执行的操作',
    p2b: '，由其密钥签名，链上锚定，可独立验证。',
    p3: 'Prova 是开源的（Apache 2.0），非托管的，运行在 Solana 上自有的 Anchor 程序之上，内置原生 Ed25519 验证。我们的存在是为了让代理互联网变得可信赖。',
    quote: '"每一个代理操作都值得拥有一张加密收据。"',
    disclaimerLabel: '法律免责声明：',
    disclaimer: 'Prova 是一个独立的软件项目，与 Solana Foundation 没有任何关联、背书或赞助关系。Solana® 是 Solana Foundation 的注册商标。Prova 不托管用户资金，也不提供财务建议。',
  },
};

export default function AboutPage() {
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
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="block">{t.headline[1]}</span>
              <span className="mt-1 block text-muted-foreground">{t.headline[2]}</span>
            </h1>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div aria-hidden />
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>{t.p1}</p>
            <p>
              {t.p2} <span className="text-foreground">{t.p2em}</span>{t.p2b}
            </p>
            <p>{t.p3}</p>
            <blockquote className="border-l-2 border-primary pl-4 font-display text-lg uppercase text-foreground">
              {t.quote}
            </blockquote>
          </div>
        </div>

        <div className="mt-16 border border-border bg-surface p-6 text-xs text-muted-foreground">
          <strong className="font-pixel text-[11px] uppercase tracking-wider text-foreground">{t.disclaimerLabel}</strong>{' '}
          {t.disclaimer}
        </div>
      </div>
    </div>
  );
}
