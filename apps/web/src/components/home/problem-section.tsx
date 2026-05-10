'use client';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'The problem',
    dateStamp: 'May 2026 · Solana mainnet',
    headline: ['15 million AI agent', 'transactions on Solana.', 'Not one leaves a', 'verifiable trail.'],
    problems: [
      {
        n: '01',
        title: 'No forensic trail',
        description: 'When an agent drains a wallet, mis-prices a swap, or hallucinates a tool call, you have no signed record of what it did. Just a JSON line in a log file someone could rewrite.',
      },
      {
        n: '02',
        title: 'Off-chain logs are evidence in name only',
        description: 'Database rows can be edited. Cloud logs expire. Nothing is cryptographically signed by the agent that did the work — so nothing holds up to a regulator, an insurer, or a judge.',
      },
      {
        n: '03',
        title: 'Identity ≠ accountability',
        description: 'Solana Agent Registry (March 2026) gives agents an on-chain identity. But identity alone does not prove what an agent did. You still need a verifiable record of every action.',
      },
    ]
  },
  ES: {
    sectionTitle: 'El problema',
    dateStamp: 'Mayo 2026 · Mainnet de Solana',
    headline: ['15 millones de transacciones', 'de agentes de IA en Solana.', 'Ninguna deja un', 'rastro verificable.'],
    problems: [
      {
        n: '01',
        title: 'Sin rastro forense',
        description: 'Cuando un agente vacía una billetera, cotiza mal un swap o alucina una llamada de herramienta, no tienes registro firmado de lo que hizo. Solo una línea JSON en un archivo de log que cualquiera podría reescribir.',
      },
      {
        n: '02',
        title: 'Logs off-chain son evidencia solo de nombre',
        description: 'Las filas de base de datos pueden editarse. Los logs en la nube expiran. Nada está firmado criptográficamente por el agente que hizo el trabajo — así que nada se sostiene ante un regulador, aseguradora o juez.',
      },
      {
        n: '03',
        title: 'Identidad ≠ responsabilidad',
        description: 'El Agent Registry de Solana (marzo 2026) da a los agentes una identidad on-chain. Pero la identidad sola no prueba qué hizo el agente. Aún necesitas un registro verificable de cada acción.',
      },
    ]
  },
  ZH: {
    sectionTitle: '面临的问题',
    dateStamp: '2026年5月 · Solana 主网',
    headline: ['Solana 上有 1500 万笔', 'AI 代理交易。', '但没有一笔留下', '可验证的轨迹。'],
    problems: [
      {
        n: '01',
        title: '没有法证轨迹',
        description: '当代理排空钱包、错误定价交换或在工具调用中产生幻觉时，你没有任何已签名的记录来证明其所作所为。只有某人可以重写的日志文件中的 JSON 行。',
      },
      {
        n: '02',
        title: '链下日志名不副实',
        description: '数据库行可被编辑，云端日志会过期。没有什么是执行该工作的代理使用密码学签名的 — 因此没有任何东西能经得起监管机构、保险公司或法官的审查。',
      },
      {
        n: '03',
        title: '身份 ≠ 问责',
        description: 'Solana Agent Registry（2026年3月）赋予代理链上身份。但仅凭身份无法证明代理做了什么。你仍然需要每一项操作的可验证记录。',
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
