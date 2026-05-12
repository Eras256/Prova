'use client';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { CheckCircle } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Solutions',
    title: 'For AI Agent Operators',
    desc: "Every agent you deploy is a liability if its actions can't be audited. Prova gives you the forensic trail you need.",
    benefits: [
      'Prove your agent acted within its authorized scope',
      'Generate compliance reports for regulators on demand',
      'Detect anomalous agent behavior before it causes damage',
      'Reduce liability exposure with cryptographic evidence',
      'Build trust with enterprise customers through transparency',
      'Meet MetaComp KYA and EU AI Act requirements',
    ],
    getStarted: 'Get Started',
    viewPricing: 'View Pricing'
  },
  ES: {
    tag: 'Soluciones',
    title: 'Para Operadores de Agentes de IA',
    desc: 'Cada agente que despliegas es una responsabilidad si sus acciones no pueden ser auditadas. Prova te da el rastro forense que necesitas.',
    benefits: [
      'Demuestra que tu agente actuó dentro de su alcance autorizado',
      'Genera informes de cumplimiento para reguladores bajo demanda',
      'Detecta comportamiento anómalo del agente antes de que cause daño',
      'Reduce la exposición de responsabilidad con evidencia criptográfica',
      'Construye confianza con clientes empresariales a través de la transparencia',
      'Cumple con los requisitos de MetaComp KYA y el AI Act de la UE',
    ],
    getStarted: 'Comenzar',
    viewPricing: 'Ver Precios'
  },
  ZH: {
    tag: '解决方案',
    title: '面向 AI 代理运营商',
    desc: '如果无法对代理的操作进行审计，那么您部署的每个代理都将成为一种负债。Prova 为您提供所需的法证追踪。',
    benefits: [
      '证明您的代理在其授权范围内行事',
      '按需为监管机构生成合规报告',
      '在造成损失前检测出异常代理行为',
      '利用密码学证据减少责任风险',
      '通过透明度建立企业客户的信任',
      '满足 MetaComp KYA 和欧盟 AI 法案的要求',
    ],
    getStarted: '开始使用',
    viewPricing: '查看定价'
  }
};

export function OperatorsContent() {
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
              {t.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div aria-hidden />
          <div>
            <div className="space-y-3">
              {t.benefits.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{b}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button asChild className="font-mono uppercase tracking-wider"><Link href="/developers/quick-start">{t.getStarted}</Link></Button>
              <Button variant="outline" asChild className="font-mono uppercase tracking-wider"><Link href="/pricing">{t.viewPricing}</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
