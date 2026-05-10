'use client';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'Deploy',
    headline: ['Make your agent', 'enterprise-ready', 'in two minutes.'],
    description: 'Install the SDK. Wrap an agent action. Watch the cryptographic receipt land on Solana. Secure your autonomous infrastructure today — no credit card, no waitlist.',
    openQuickStart: 'Open the Quick Start',
    readDocs: 'Read the Docs',
    questions: 'Questions about enterprise integration?',
    talkToEngineer: 'Talk to a Security Engineer →'
  },
  ES: {
    sectionTitle: 'Desplegar',
    headline: ['Haz a tu agente', 'listo para empresas', 'en dos minutos.'],
    description: 'Instala el SDK. Envuelve una acción del agente. Mira cómo el recibo criptográfico llega a Solana. Asegura tu infraestructura autónoma hoy — sin tarjeta de crédito, sin listas de espera.',
    openQuickStart: 'Abrir el Inicio Rápido',
    readDocs: 'Leer la Documentación',
    questions: '¿Preguntas sobre integración empresarial?',
    talkToEngineer: 'Habla con un Ingeniero de Seguridad →'
  },
  ZH: {
    sectionTitle: '开始',
    headline: ['接下来的两分钟内，', '完成你的', '第一个证明。'],
    description: '安装 SDK。包装一个代理操作。看着收据登录 Solana。前100名免费 — 无需信用卡，无需销售电话，无需等待名单。',
    openQuickStart: '打开快速入门',
    readDocs: '阅读文档',
    questions: '开始前有问题？',
    talkToEngineer: '与工程师交谈 →'
  }
};

export function FinalCta() {
  const { lang } = useI18n();
  const t = content[lang];
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
        <div>
          <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.sectionTitle}</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
            <span className="block">{t.headline[0]}</span>
            <span className="block">{t.headline[1]}</span>
            <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">{t.headline[2]}</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.description}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">terminal</span>
              <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">~/your-agent</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-4 font-mono text-sm">
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground">npm install</span>
              <a href="https://www.npmjs.com/package/prova-agent-sdk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">prova-agent-sdk</a>
              <span className="ml-1 inline-block h-4 w-[7px] animate-blink bg-primary align-middle" aria-hidden />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-12 flex-1 gap-2 px-6 text-sm font-semibold uppercase tracking-wider">
              <Link href="/developers/quick-start">
                {t.openQuickStart}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 flex-1 px-6 text-sm font-semibold uppercase tracking-wider">
              <Link href="/developers/docs">{t.readDocs}</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {t.questions}{' '}
            <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">
              {t.talkToEngineer}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
