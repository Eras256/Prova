'use client';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { CheckCircle } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Solutions',
    title: 'For Legal Professionals',
    desc: "When AI agents execute transactions, traditional logs are hearsay. Prova's on-chain attestations provide court-admissible, cryptographically sealed evidence.",
    benefits: [
      'Meet FRE 901 standards for court admissibility natively',
      'Defend against agent-liability claims with immutable data',
      'Reduce expert witness reliance in technology disputes',
      'Prove exactly what the model decided and when',
      'Transparent conflict resolution for Machine Payment Protocol',
    ],
    getStarted: 'Read Architecture',
    viewPricing: 'Contact Us'
  },
  ES: {
    tag: 'Soluciones',
    title: 'Para Profesionales Legales',
    desc: 'Cuando los agentes de IA ejecutan transacciones, los logs tradicionales son evidencia de oídas. Las atestaciones on-chain de Prova proveen evidencia admisible en tribunales, sellada criptográficamente.',
    benefits: [
      'Cumple nativamente los estándares FRE 901 para admisibilidad en cortes',
      'Defensa contra demandas de responsabilidad de agentes con datos inmutables',
      'Reduce la dependencia de peritos informáticos en disputas tecnológicas',
      'Demuestra exactamente qué decidió el modelo y cuándo',
      'Resolución de conflictos transparente para el Machine Payment Protocol',
    ],
    getStarted: 'Leer Arquitectura',
    viewPricing: 'Contáctanos'
  },
  ZH: {
    tag: '解决方案',
    title: '面向法律专业人士',
    desc: '当 AI 代理执行交易时，传统日志只是传闻证据。Prova 的链上证明提供了法庭可采信的密码学密封证据。',
    benefits: [
      '原生符合 FRE 901 法庭证据采信标准',
      '使用不可篡改的数据对抗代理责任索赔',
      '减少技术纠纷中对专家证人的依赖',
      '确切证明模型在何时做出了何种决定',
      '针对机器支付协议提供透明的冲突解决机制',
    ],
    getStarted: '阅读架构',
    viewPricing: '联系我们'
  }
};

export function LegalContent() {
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
              <Button asChild className="font-mono uppercase tracking-wider"><Link href="/product">{t.getStarted}</Link></Button>
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
