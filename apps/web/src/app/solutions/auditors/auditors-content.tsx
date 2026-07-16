'use client';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { CheckCircle } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Solutions',
    title: 'For Auditors & Underwriters',
    desc: "Pricing risk for autonomous systems is impossible without ground truth. Prova provides an immutable, transparent trail of every AI decision for deterministic underwriting.",
    benefits: [
      'Price agentic insurance policies using verifiable history',
      'Conduct JARGUS internal pre-audits effortlessly',
      'Automate compliance checks via REST API & Webhooks',
      'Reduce audit cycles from quarters to days',
      'Real-time observability of autonomous system liabilities',
    ],
    getStarted: 'Explore Explorer',
    viewPricing: 'Contact Us'
  },
  ES: {
    tag: 'Soluciones',
    title: 'Para Auditores y Aseguradoras',
    desc: 'Calcular el precio del riesgo de sistemas autónomos es imposible sin una verdad fundamental. Prova provee un rastro inmutable y transparente de cada decisión de la IA para suscripción determinista.',
    benefits: [
      'Cotiza pólizas de seguros para agentes usando historial verificable',
      'Realiza pre-auditorías internas JARGUS sin esfuerzo',
      'Automatiza revisiones de cumplimiento vía API REST y Webhooks',
      'Reduce los ciclos de auditoría de trimestres a días',
      'Observabilidad en tiempo real de los pasivos del sistema autónomo',
    ],
    getStarted: 'Explorar Explorer',
    viewPricing: 'Contáctanos'
  },
  ZH: {
    tag: '解决方案',
    title: '面向审计员和承保人',
    desc: '如果没有基础事实，为自主系统定价风险是不可能的。Prova 为每一项 AI 决定提供不可篡改且透明的追踪，以实现确定性的承保。',
    benefits: [
      '使用可验证的历史记录为代理保险保单定价',
      '轻松进行 JARGUS 内部预审计',
      '通过 REST API 和 Webhooks 自动化合规检查',
      '将审计周期从几个季度缩短到几天',
      '实时观察自主系统的责任风险',
    ],
    getStarted: '探索浏览器',
    viewPricing: '联系我们'
  }
};

export function AuditorsContent() {
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
          <div aria-hidden className="hidden lg:block" />
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
              <Button asChild className="font-mono uppercase tracking-wider"><Link href="/explorer">{t.getStarted}</Link></Button>
              <Button variant="outline" asChild className="font-mono uppercase tracking-wider"><Link href="/contact">{t.viewPricing}</Link></Button>
            </div>
            
            <div className="mt-8 border border-border p-4 text-xs text-muted-foreground">
              <p>
                <strong>Disclaimer:</strong> JARGUS audits are internal and do not substitute audits from top-tier firms. Prova operates in full accordance with the Solana.org Developer Guidelines and the Solana Foundation Code of Conduct updated as of May 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
