'use client';
import { Button, Badge } from '@prova/ui';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Pricing',
    headline: ['Pay only for', 'the receipts', 'you sign.'],
    desc: 'From less than a tenth of a cent per attestation. Free for the first 100 every month, forever — no card, no expiring trial.',
    plans: [
      {
        name: 'Free',
        price: '$0',
        period: 'forever',
        desc: 'For prototypes and weekend builds',
        attestations: '100 / month',
        support: 'Community Discord',
        features: ['Full SDK access', 'Public Forensic Explorer', 'Devnet + Mainnet', 'Apache 2.0 source'],
        cta: 'Start free',
        href: '/developers/quick-start',
        highlight: false,
      },
      {
        name: 'Builder',
        price: '$49',
        period: 'per month',
        desc: 'For solo devs shipping their first agent',
        attestations: '10,000 / month',
        support: 'Email · 48h response',
        features: ['Everything in Free', 'Webhooks + API keys', 'Basic CSV reports', 'Priority Solana RPC'],
        cta: 'Start Builder',
        href: '/app/billing?plan=builder',
        highlight: false,
      },
      {
        name: 'Growth',
        price: '$499',
        period: 'per month',
        desc: 'For teams running agents in production',
        attestations: '100,000 / month',
        support: 'Email · 24h response',
        features: [
          'Everything in Builder',
          'Custom attestation schemas',
          'PDF forensic exports',
          'Vanish privacy mode',
          'Priority indexing SLA',
        ],
        cta: 'Start Growth',
        href: '/app/billing?plan=growth',
        highlight: true,
        badge: 'Most teams pick this',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: 'tailored',
        desc: 'For compliance leads and regulated workloads',
        attestations: 'Unlimited',
        support: 'Dedicated CSM + Slack',
        features: [
          'Everything in Growth',
          'Signed SLA + uptime credits',
          'Self-hosted indexer option',
          'SSO / SAML',
          'DPA, MSA, custom terms',
        ],
        cta: 'Talk to sales',
        href: '/contact?topic=enterprise',
        highlight: false,
      },
    ],
    attestationsLabel: 'attestations',
    singleReport: {
      title: 'Just need a single forensic report?',
      desc: 'Skip the subscription. Pay $0.01 per Explorer query with x402 micropayments — no account, no commitment.',
      cta: 'Try the Explorer'
    },
    switching: {
      title: 'Switching from off-chain logging?',
      desc: "We'll waive your first month and migrate the last 90 days of your existing logs into signed attestations.",
      cta: 'Book a 20-min call'
    },
    footer: 'All plans include the Apache 2.0 SDK. No vendor lock-in. Export your attestations to anywhere — they live on Solana, not on our servers.'
  },
  ES: {
    tag: 'Precios',
    headline: ['Paga solo por', 'los recibos', 'que firmas.'],
    desc: 'Desde menos de una décima de centavo por atestación. Gratis las primeras 100 cada mes, para siempre — sin tarjeta, sin prueba que caduque.',
    plans: [
      {
        name: 'Gratis',
        price: '$0',
        period: 'para siempre',
        desc: 'Para prototipos y proyectos de fin de semana',
        attestations: '100 / mes',
        support: 'Discord de la comunidad',
        features: ['Acceso completo al SDK', 'Explorador Forense Público', 'Devnet + Mainnet', 'Código fuente Apache 2.0'],
        cta: 'Empezar gratis',
        href: '/developers/quick-start',
        highlight: false,
      },
      {
        name: 'Constructor',
        price: '$49',
        period: 'al mes',
        desc: 'Para devs en solitario enviando su primer agente',
        attestations: '10,000 / mes',
        support: 'Email · respuesta 48h',
        features: ['Todo lo de Gratis', 'Webhooks + API keys', 'Reportes CSV básicos', 'RPC de Solana prioritario'],
        cta: 'Empezar Constructor',
        href: '/app/billing?plan=builder',
        highlight: false,
      },
      {
        name: 'Crecimiento',
        price: '$499',
        period: 'al mes',
        desc: 'Para equipos corriendo agentes en producción',
        attestations: '100,000 / mes',
        support: 'Email · respuesta 24h',
        features: [
          'Todo lo de Constructor',
          'Esquemas de atestación personalizados',
          'Exportación forense en PDF',
          'Modo de privacidad Vanish',
          'SLA de indexación prioritaria',
        ],
        cta: 'Empezar Crecimiento',
        href: '/app/billing?plan=growth',
        highlight: true,
        badge: 'La mayoría de equipos elige este',
      },
      {
        name: 'Empresarial',
        price: 'A medida',
        period: 'personalizado',
        desc: 'Para líderes de cumplimiento y cargas reguladas',
        attestations: 'Ilimitado',
        support: 'CSM Dedicado + Slack',
        features: [
          'Todo lo de Crecimiento',
          'SLA firmado + créditos de uptime',
          'Opción de indexador autoalojado',
          'SSO / SAML',
          'DPA, MSA, términos personalizados',
        ],
        cta: 'Hablar con ventas',
        href: '/contact?topic=enterprise',
        highlight: false,
      },
    ],
    attestationsLabel: 'atestaciones',
    singleReport: {
      title: '¿Solo necesitas un reporte forense único?',
      desc: 'Sáltate la suscripción. Paga $0.01 por consulta en el Explorer con micropagos x402 — sin cuenta, sin compromisos.',
      cta: 'Probar el Explorador'
    },
    switching: {
      title: '¿Cambiando de registros off-chain?',
      desc: "Te perdonamos el primer mes y migramos los últimos 90 días de tus registros actuales a atestaciones firmadas.",
      cta: 'Agenda una llamada de 20 min'
    },
    footer: 'Todos los planes incluyen el SDK Apache 2.0. Sin encerramiento por proveedor. Exporta tus atestaciones a donde sea — viven en Solana, no en nuestros servidores.'
  },
  ZH: {
    tag: '定价',
    headline: ['只需为您签署的', '收据', '付费。'],
    desc: '每次证明只需不到十分之一美分。每月前 100 次终身免费 — 无需信用卡，无需担心试用期。',
    plans: [
      {
        name: '免费',
        price: '$0',
        period: '永久',
        desc: '适用于原型开发和周末项目',
        attestations: '100 / 月',
        support: '社区 Discord',
        features: ['完整的 SDK 访问权限', '公共法证浏览器', 'Devnet + Mainnet', 'Apache 2.0 源码'],
        cta: '免费开始',
        href: '/developers/quick-start',
        highlight: false,
      },
      {
        name: '构建者',
        price: '$49',
        period: '每月',
        desc: '适用于发布首个代理的独立开发者',
        attestations: '10,000 / 月',
        support: '邮件 · 48小时内回复',
        features: ['免费版所有功能', 'Webhooks + API 密钥', '基础 CSV 报告', '优先 Solana RPC'],
        cta: '开始构建',
        href: '/app/billing?plan=builder',
        highlight: false,
      },
      {
        name: '成长',
        price: '$499',
        period: '每月',
        desc: '适用于在生产环境中运行代理的团队',
        attestations: '100,000 / 月',
        support: '邮件 · 24小时内回复',
        features: [
          '构建者所有功能',
          '自定义证明模式',
          'PDF 法证导出',
          'Vanish 隐私模式',
          '优先索引 SLA',
        ],
        cta: '开始成长',
        href: '/app/billing?plan=growth',
        highlight: true,
        badge: '多数团队的首选',
      },
      {
        name: '企业级',
        price: '定制',
        period: '定制',
        desc: '适用于合规主管和受监管工作负载',
        attestations: '无限制',
        support: '专属客户成功经理 + Slack',
        features: [
          '成长版所有功能',
          '签署 SLA + 正常运行时间积分',
          '自托管索引器选项',
          'SSO / SAML',
          '数据处理协议, 框架协议, 定制条款',
        ],
        cta: '联系销售',
        href: '/contact?topic=enterprise',
        highlight: false,
      },
    ],
    attestationsLabel: '次证明',
    singleReport: {
      title: '只需要一份单一的法证报告？',
      desc: '跳过订阅。使用 x402 微支付每次浏览器查询支付 $0.01 — 无需账户，无需承诺。',
      cta: '尝试使用浏览器'
    },
    switching: {
      title: '从链下日志记录迁移？',
      desc: "我们将免除您首月的费用，并将您现有日志的过去 90 天数据迁移为已签署的证明。",
      cta: '预约 20 分钟通话'
    },
    footer: '所有计划均包含 Apache 2.0 SDK。没有供应商锁定。您可以将您的证明导出到任何地方——它们存储在 Solana 上，而不是我们的服务器上。'
  }
};

export function PricingContent() {
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
              <span className="block">{t.headline[1]}</span>
              <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">{t.headline[2]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-px bg-border border border-border md:grid-cols-2 lg:grid-cols-4">
          {t.plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`bg-background relative flex flex-col gap-5 p-7 ${plan.highlight ? 'bg-primary/5' : ''}`}
            >
              {'badge' in plan && plan.badge && (
                <div className="absolute -top-2.5 left-7">
                  <Badge className="border-0 bg-primary font-pixel text-[12px] uppercase tracking-wider text-primary-foreground">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div>
                <h3 className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl uppercase text-foreground lg:text-4xl">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              </div>

              <div className="border-y border-border py-4">
                <p className="text-sm">
                  <span className="text-foreground">{plan.attestations}</span>{' '}
                  <span className="text-muted-foreground">{t.attestationsLabel}</span>
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {plan.support}
                </p>
              </div>

              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-auto w-full"
                variant={plan.highlight ? 'default' : 'outline'}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-px bg-border border border-border md:grid-cols-2">
          <div className="bg-background p-8">
            <h2 className="font-display text-xl uppercase text-foreground">{t.singleReport.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t.singleReport.desc}
            </p>
            <Button variant="outline" className="mt-5" asChild>
              <Link href="/explorer">{t.singleReport.cta}</Link>
            </Button>
          </div>
          <div className="bg-background p-8">
            <h2 className="font-display text-xl uppercase text-foreground">{t.switching.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t.switching.desc}
            </p>
            <Button variant="outline" className="mt-5" asChild>
              <Link href="/contact?topic=migration">{t.switching.cta}</Link>
            </Button>
          </div>
        </div>

        <p className="mt-16 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t.footer}
        </p>
      </div>
    </div>
  );
}
