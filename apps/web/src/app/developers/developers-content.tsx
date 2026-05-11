'use client';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { ArrowRight, Github, BookOpen, Code2, Puzzle, ExternalLink } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Developers',
    headline: ['Wrap an agent action.', 'Get a receipt that', 'survives anything.'],
    desc: 'Free, open-source TypeScript SDK. No proprietary runtime, no vendor lock-in — a thin wrapper around the Solana Attestation Service.',
    quickStart: 'Open the Quick Start',
    github: 'Star on GitHub',
    installTag: 'Install',
    installTitle: 'Five lines from npm to on-chain receipt.',
    tsTag: 'TypeScript / JavaScript',
    resources: [
      {
        n: '01',
        icon: BookOpen,
        title: 'Quick start',
        desc: 'Five lines from npm install to a verified on-chain receipt.',
        href: '/developers/quick-start',
        cta: 'Open quick start',
      },
      {
        n: '02',
        icon: Code2,
        title: 'API & MCP reference',
        desc: 'Every endpoint, with a try-it console powered by your own key. Includes native MCP server for AI IDEs.',
        href: '/developers/docs',
        cta: 'Browse API & MCP',
      },
      {
        n: '03',
        icon: Puzzle,
        title: 'SDK reference',
        desc: 'On-chain ProvaClient + REST ProvaApiClient. Two clients, same surface.',
        href: '/developers/sdks',
        cta: 'View SDK',
      },
    ]
  },
  ES: {
    tag: 'Desarrolladores',
    headline: ['Envuelve una acción del agente.', 'Obtén un recibo que', 'sobreviva a cualquier cosa.'],
    desc: 'SDK gratuito y de código abierto para TypeScript. Sin tiempo de ejecución propietario, sin ataduras a proveedores — un envoltorio ligero alrededor del Servicio de Atestación de Solana.',
    quickStart: 'Abrir el Inicio Rápido',
    github: 'Destacar en GitHub',
    installTag: 'Instalar',
    installTitle: 'Cinco líneas desde npm hasta el recibo on-chain.',
    tsTag: 'TypeScript / JavaScript',
    resources: [
      {
        n: '01',
        icon: BookOpen,
        title: 'Inicio rápido',
        desc: 'Cinco líneas desde npm install hasta un recibo verificado on-chain.',
        href: '/developers/quick-start',
        cta: 'Abrir inicio rápido',
      },
      {
        n: '02',
        icon: Code2,
        title: 'Referencia de la API y MCP',
        desc: 'Cada endpoint, con una consola de prueba alimentada por tu propia llave. Incluye servidor MCP nativo para IDEs de IA.',
        href: '/developers/docs',
        cta: 'Explorar API y MCP',
      },
      {
        n: '03',
        icon: Puzzle,
        title: 'Referencia del SDK',
        desc: 'ProvaClient on-chain + ProvaApiClient REST. Dos clientes, misma superficie.',
        href: '/developers/sdks',
        cta: 'Ver SDK',
      },
    ]
  },
  ZH: {
    tag: '开发者',
    headline: ['包装代理操作。', '获得一个', '在任何情况下都能存活的收据。'],
    desc: '免费、开源的 TypeScript SDK。无专有运行环境，无供应商锁定——这只是一个对 Solana 证明服务的轻量封装。',
    quickStart: '打开快速入门',
    github: '在 GitHub 上标星',
    installTag: '安装',
    installTitle: '从 npm 到链上收据只需五行。',
    tsTag: 'TypeScript / JavaScript',
    resources: [
      {
        n: '01',
        icon: BookOpen,
        title: '快速入门',
        desc: '从 npm install 到经过验证的链上收据只需五行代码。',
        href: '/developers/quick-start',
        cta: '打开快速入门',
      },
      {
        n: '02',
        icon: Code2,
        title: 'API 与 MCP 参考',
        desc: '每一个接口，都有使用您自己的密钥驱动的测试控制台。包含用于 AI IDE 的原生 MCP 服务器。',
        href: '/developers/docs',
        cta: '浏览 API 与 MCP',
      },
      {
        n: '03',
        icon: Puzzle,
        title: 'SDK 参考',
        desc: '链上 ProvaClient + REST ProvaApiClient。两个客户端，相同的接口。',
        href: '/developers/sdks',
        cta: '查看 SDK',
      },
    ]
  }
};

export function DevelopersContent() {
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
              <span className="mt-2 block text-muted-foreground">{t.headline[1]}</span>
              <span className="block text-muted-foreground">{t.headline[2]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/developers/quick-start">{t.quickStart}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <a href="https://github.com/Eras256/Prova" target="_blank" rel="noreferrer noopener">
                  <Github className="h-4 w-4" />
                  {t.github}
                </a>
              </Button>
            </div>
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {t.resources.map((r) => (
            <li
              key={r.n}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-[auto_auto_1fr_2fr_auto] lg:items-center lg:gap-12 lg:py-12"
            >
              <span className="font-mono text-xs text-primary">{r.n}</span>
              <r.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              <h2 className="font-display text-base uppercase text-foreground lg:text-lg">{r.title}</h2>
              <p className="text-base leading-relaxed text-muted-foreground">{r.desc}</p>
              <Button variant="ghost" size="sm" asChild className="-ml-2 justify-self-start gap-1 text-primary lg:justify-self-end">
                <Link href={r.href}>
                  {r.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </li>
          ))}
        </ol>

        <div className="mt-20">
          <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">Endpoints</p>
          <h2 className="mt-3 font-display text-xl uppercase text-foreground sm:text-3xl">
            Production Services
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="border border-border bg-background p-6">
              <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">REST API & MCP</span>
              <a
                href="https://prova-api.fly.dev/api/v1/health"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 flex items-center gap-1.5 font-mono text-sm text-foreground hover:text-primary"
              >
                https://prova-api.fly.dev
                <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
              </a>
            </div>
            <div className="border border-border bg-background p-6">
              <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">npm package</span>
              <a
                href="https://www.npmjs.com/package/prova-agent-sdk"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 flex items-center gap-1.5 font-mono text-sm text-foreground hover:text-primary"
              >
                npmjs.com/package/prova-agent-sdk
                <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.installTag}</p>
          <h2 className="mt-3 font-display text-xl uppercase text-foreground sm:text-3xl">
            {t.installTitle}
          </h2>
          <div className="mt-8 border border-border bg-background p-6">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.tsTag}</span>
              <a
                href="https://www.npmjs.com/package/prova-agent-sdk"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1 font-pixel text-[12px] uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                Node 18+ · v0.1.6 · Apache 2.0
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <pre className="mt-3 font-mono text-sm text-foreground">npm install prova-agent-sdk</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
