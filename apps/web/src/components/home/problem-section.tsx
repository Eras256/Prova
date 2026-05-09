'use client';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'The problem',
    dateStamp: 'May 2026 · Solana mainnet',
    headline: ['24,000 AI agents are', 'live on Solana.', 'Not one can prove', 'what it did yesterday.'],
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
        title: 'Regulators are already writing the rules',
        description: 'EU AI Act, MetaComp KYA, and the next round of US state-level frameworks all require operator-side accountability. "We have logs" stops being an answer in 2026.',
      },
    ]
  },
  ES: {
    sectionTitle: 'El problema',
    dateStamp: 'Mayo 2026 · Mainnet de Solana',
    headline: ['24,000 agentes de IA están', 'en vivo en Solana.', 'Ni uno solo puede probar', 'lo que hizo ayer.'],
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
        title: 'Los reguladores ya están escribiendo las reglas',
        description: 'El EU AI Act, MetaComp KYA y los frameworks estatales en EE.UU. requieren responsabilidad del operador. "Tenemos logs" dejará de ser una respuesta en 2026.',
      },
    ]
  },
  ZH: {
    sectionTitle: '面临的问题',
    dateStamp: '2026年5月 · Solana 主网',
    headline: ['有 24,000 个 AI 代理', '在 Solana 上活跃。', '但没有一个能证明', '它昨天做了什么。'],
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
        title: '监管机构已经开始制定规则',
        description: '欧盟 AI 法案、MetaComp KYA 和下一轮美国州级框架都要求操作员端负责任。“我们有日志”在2026年将不再是一个可接受的回答。',
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
