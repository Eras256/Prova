'use client';
import { Scale, ShieldCheck, FileSearch, BarChart3 } from 'lucide-react';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'For Enterprise Risk & Compliance',
    headline: ['Zero-trust execution.', 'Four enterprise teams that', 'can finally scale AI.'],
    cases: [
      {
        icon: Scale,
        persona: 'Compliance',
        title: 'Pass JARGUS & EU AI Act audits instantly',
        desc: 'Map every autonomous action to strict regulatory frameworks. Export cryptographic PDF reports that Tier-1 auditors trust natively. (Note: JARGUS is an internal audit and does not substitute audits from top-tier firms).',
      },
      {
        icon: ShieldCheck,
        persona: 'Underwriters',
        title: 'Price agentic risk with immutable data',
        desc: 'Settle agent-driven claims via Machine Payment Protocol logs in days, not quarters. Cryptographic proof replaces guesswork.',
      },
      {
        icon: FileSearch,
        persona: 'Legal',
        title: 'Court-admissible by construction',
        desc: 'On-chain Solana attestations meet the Federal Rules of Evidence 901 standard for authenticity — no expert witness required.',
      },
      {
        icon: BarChart3,
        persona: 'Risk & Ops',
        title: 'Real-time observability for autonomous systems',
        desc: 'Stream verified agent attestations directly into Datadog, Splunk, or your SIEM. Catch LLM hallucinations before they cost millions.',
      },
    ]
  },
  ES: {
    sectionTitle: 'Para Riesgo y Cumplimiento Empresarial',
    headline: ['Ejecución Zero-trust.', 'Cuatro equipos que al fin', 'pueden escalar IA.'],
    cases: [
      {
        icon: Scale,
        persona: 'Cumplimiento',
        title: 'Pasa auditorías JARGUS y EU AI Act al instante',
        desc: 'Mapea cada acción autónoma a marcos regulatorios estrictos. Exporta reportes PDF criptográficos en los que los auditores Tier-1 confían nativamente. (Nota: JARGUS es una auditoría interna y no sustituye a las auditorías de firmas top-tier).',
      },
      {
        icon: ShieldCheck,
        persona: 'Aseguradoras',
        title: 'Precio del riesgo autónomo con datos inmutables',
        desc: 'Resuelve reclamos derivados del Machine Payment Protocol en días. La prueba criptográfica reemplaza para siempre las suposiciones.',
      },
      {
        icon: FileSearch,
        persona: 'Legal',
        title: 'Admisible en tribunales por diseño',
        desc: 'Las atestaciones on-chain en Solana cumplen el estándar 901 de Reglas Federales de Evidencia — sin necesidad de peritos.',
      },
      {
        icon: BarChart3,
        persona: 'Riesgo y Ops',
        title: 'Observabilidad en tiempo real de sistemas autónomos',
        desc: 'Transmite atestaciones verificadas a Datadog, Splunk o tu SIEM. Detecta alucinaciones de LLMs antes de que cuesten millones.',
      },
    ]
  },
  ZH: {
    sectionTitle: '为承担风险的人准备',
    headline: ['一张收据。', '让四类关键人员', '终于能安稳入睡。'],
    cases: [
      {
        icon: Scale,
        persona: '合规审查员',
        title: '一次性通过 AI 法案审计',
        desc: '将代理的每一项操作映射到 MetaComp KYA 和欧盟 AI 法案条款。导出审计员真正认可的 PDF 报告。',
      },
      {
        icon: ShieldCheck,
        persona: '承保人',
        title: '用确凿证据为代理风险定价',
        desc: '在几天而不是几个季度内解决与代理相关的索赔。密码学证明将永远取代“客户说……”。',
      },
      {
        icon: FileSearch,
        persona: '法务',
        title: '法庭采信的设计',
        desc: '链上证明符合《联邦证据规则》901 的真实性标准 —— 无需专家证人即可采信。',
      },
      {
        icon: BarChart3,
        persona: '风险与运营',
        title: '在造成损失前捕捉偏差',
        desc: '将证明流输入至 Datadog、Splunk 或您自己的 SIEM。通过实时仪表板了解每位代理的实际操作。',
      },
    ]
  }
};

export function UseCasesGrid() {
  const { lang } = useI18n();
  const t = content[lang];
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.sectionTitle}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="mt-2 block text-muted-foreground">{t.headline[1]}</span>
              <span className="block text-muted-foreground">{t.headline[2]}</span>
            </h2>
          </div>
        </div>

        <div className="grid border-t border-border md:grid-cols-2 md:divide-x md:divide-border lg:grid-cols-4">
          {t.cases.map((c, i) => (
            <article
              key={c.persona}
              className={`flex flex-col gap-5 border-b border-border p-8 ${
                i % 2 === 1 ? 'border-l border-border md:border-l-0' : ''
              } lg:border-b-0`}
            >
              <c.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <p className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
                {c.persona}
              </p>
              <h3 className="font-display text-base uppercase leading-tight text-foreground sm:text-lg">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
