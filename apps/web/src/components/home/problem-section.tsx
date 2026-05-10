'use client';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'The Problem',
    dateStamp: 'May 2026 · Solana mainnet',
    headline: ['95% of Solana Txs', 'are AI-driven.', 'None leave a', 'forensic trail.'],
    problems: [
      {
        n: '01',
        title: 'Cloud logs aren\'t evidence',
        description: 'When an autonomous agent trades millions via Jupiter or executes a margin call, a JSON line in AWS is not enough. You need cryptographic evidence that cannot be altered or denied.',
      },
      {
        n: '02',
        title: 'The Machine Economy requires zero-trust',
        description: 'With the Machine Payment Protocol (MPP) scaling, agents pay for APIs autonomously. If a dispute arises, off-chain logs hold no weight for enterprise regulators, insurers, or courts.',
      },
      {
        n: '03',
        title: 'Identity ≠ Accountability',
        description: 'The Solana Agent Registry gives agents an on-chain identity. But identity alone does not prove what an agent actually did. True accountability demands a verifiable receipt for every action.',
      },
    ]
  },
  ES: {
    sectionTitle: 'El Problema',
    dateStamp: 'Mayo 2026 · Mainnet de Solana',
    headline: ['95% de las Txs', 'son de Agentes IA.', 'Ninguna deja un', 'rastro forense.'],
    problems: [
      {
        n: '01',
        title: 'Los logs en la nube no son evidencia',
        description: 'Cuando un agente autónomo mueve millones vía Jupiter o ejecuta un margen de liquidación, un log en AWS no sirve. Necesitas evidencia criptográfica inalterable e innegable.',
      },
      {
        n: '02',
        title: 'La economía de máquinas exige zero-trust',
        description: 'Con el escalamiento del Machine Payment Protocol (MPP), los agentes pagan APIs de forma autónoma. En caso de disputa, los logs off-chain no tienen validez ante reguladores, aseguradoras o cortes.',
      },
      {
        n: '03',
        title: 'Identidad ≠ Responsabilidad',
        description: 'El Agent Registry de Solana da identidad on-chain a los agentes. Pero la identidad por sí sola no prueba lo que hicieron. La verdadera responsabilidad exige un recibo verificable de cada acción.',
      },
    ]
  },
  ZH: {
    sectionTitle: '面临的问题',
    dateStamp: '2026年5月 · Solana 主网',
    headline: ['Solana 上 95% 的交易', '由 AI 驱动。', '但没有一笔留下', '法证级轨迹。'],
    problems: [
      {
        n: '01',
        title: '云端日志不是证据',
        description: '当自主代理通过 Jupiter 交易数百万资金或执行追加保证金时，AWS 中的 JSON 日志是不够的。你需要不可篡改且无法否认的密码学证据。',
      },
      {
        n: '02',
        title: '机器经济需要零信任',
        description: '随着机器支付协议 (MPP) 的普及，代理自主支付 API 费用。如果出现争议，链下日志在企业监管机构、保险公司或法庭面前毫无分量。',
      },
      {
        n: '03',
        title: '身份 ≠ 问责',
        description: 'Solana 代理注册表赋予了代理链上身份。但仅凭身份无法证明代理实际做了什么。真正的问责制要求为每一项操作提供可验证的收据。',
      },
    ]
  }
};

export function ProblemSection() {
  const { lang } = useI18n();
  const t = content[lang];
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-pixel text-[13px] uppercase tracking-wider text-muted-foreground">
              {t.sectionTitle}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {t.dateStamp}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="block">{t.headline[1]}</span>
              <span className="mt-2 block text-muted-foreground">{t.headline[2]}</span>
              <span className="block text-muted-foreground">{t.headline[3]}</span>
            </h2>
          </div>
        </div>

        <div className="border-t border-border">
          {t.problems.map((p) => (
            <div
              key={p.n}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-[auto_1fr_2fr] lg:gap-12 lg:py-14"
            >
              <span className="font-mono text-xs text-primary">{p.n}</span>
              <h3 className="font-display text-lg uppercase tracking-tight text-foreground lg:text-xl">{p.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
