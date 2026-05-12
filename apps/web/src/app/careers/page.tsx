'use client';

import Link from 'next/link';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Careers',
    headline: ['Build the trust layer', 'for the agentic internet.'],
    desc: 'We are a small, focused team working on infrastructure that matters. Remote-first, async-friendly.',
    applyBtn: 'Apply →',
    openings: [
      { title: 'Senior Solana Engineer',  type: 'Full-time', location: 'Remote', req: ['5+ years Rust', 'Anchor/Solana program experience', 'Security mindset'] },
      { title: 'Frontend Engineer',       type: 'Full-time', location: 'Remote', req: ['Next.js 15 / React 19', 'TypeScript', 'Tailwind CSS'] },
      { title: 'Developer Relations',     type: 'Full-time', location: 'Remote', req: ['Technical writing', 'Community building', 'Solana ecosystem knowledge'] },
    ],
  },
  ES: {
    tag: 'Empleos',
    headline: ['Construye la capa de confianza', 'del internet de agentes.'],
    desc: 'Somos un equipo pequeño y enfocado trabajando en infraestructura que importa. Trabajo remoto, cultura asíncrona.',
    applyBtn: 'Aplicar →',
    openings: [
      { title: 'Ingeniero Senior Solana', type: 'Tiempo completo', location: 'Remoto', req: ['5+ años en Rust', 'Experiencia con Anchor/Solana', 'Mentalidad de seguridad'] },
      { title: 'Ingeniero Frontend',      type: 'Tiempo completo', location: 'Remoto', req: ['Next.js 15 / React 19', 'TypeScript', 'Tailwind CSS'] },
      { title: 'Developer Relations',     type: 'Tiempo completo', location: 'Remoto', req: ['Escritura técnica', 'Construcción de comunidad', 'Ecosistema Solana'] },
    ],
  },
  ZH: {
    tag: '招聘',
    headline: ['构建代理互联网的', '信任层。'],
    desc: '我们是一个专注的小团队，致力于构建重要的基础设施。远程优先，异步友好。',
    applyBtn: '申请 →',
    openings: [
      { title: '高级 Solana 工程师', type: '全职', location: '远程', req: ['5 年以上 Rust 经验', 'Anchor/Solana 程序经验', '安全思维'] },
      { title: '前端工程师',         type: '全职', location: '远程', req: ['Next.js 15 / React 19', 'TypeScript', 'Tailwind CSS'] },
      { title: '开发者关系',         type: '全职', location: '远程', req: ['技术写作', '社区建设', 'Solana 生态系统知识'] },
    ],
  },
};

export default function CareersPage() {
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
              <span className="mt-1 block text-muted-foreground">{t.headline[1]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.desc}</p>
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {t.openings.map((o) => (
            <li
              key={o.title}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-[1fr_2fr_auto] lg:items-center lg:gap-12 lg:py-12"
            >
              <div>
                <h2 className="font-display text-lg uppercase text-foreground">{o.title}</h2>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{o.type} · {o.location}</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {o.req.map((r) => (
                  <li key={r} className="border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
                    {r}
                  </li>
                ))}
              </ul>
              <Link
                href={`mailto:neuralsol7@gmail.com?subject=${encodeURIComponent(`Application: ${o.title}`)}`}
                className="shrink-0 border border-primary bg-primary px-4 py-2 font-mono text-xs uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                {t.applyBtn}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
