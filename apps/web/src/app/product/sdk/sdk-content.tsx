'use client';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { Code2, ExternalLink } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Product',
    title: 'Agent SDK',
    desc: 'TypeScript and Rust SDKs to easily integrate Prova into your AI agents. Built natively for elizaOS, Anchor, and standard REST architectures.',
    packagesLabel: 'Packages',
    ts: 'TypeScript / Node.js',
    rs: 'Rust',
    docsLabel: 'Documentation',
    getStarted: 'Read SDK Docs',
  },
  ES: {
    tag: 'Producto',
    title: 'SDK para Agentes',
    desc: 'SDKs en TypeScript y Rust para integrar Prova fácilmente en tus agentes de IA. Construido nativamente para elizaOS, Anchor y arquitecturas REST estándar.',
    packagesLabel: 'Paquetes',
    ts: 'TypeScript / Node.js',
    rs: 'Rust',
    docsLabel: 'Documentación',
    getStarted: 'Leer Docs del SDK',
  },
  ZH: {
    tag: '产品',
    title: '代理 SDK',
    desc: '提供 TypeScript 和 Rust SDK，以便将 Prova 轻松集成到您的 AI 代理中。为 elizaOS、Anchor 和标准 REST 架构原生构建。',
    packagesLabel: '包',
    ts: 'TypeScript / Node.js',
    rs: 'Rust',
    docsLabel: '文档',
    getStarted: '阅读 SDK 文档',
  },
};

export function SdkContent() {
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
            <Code2 className="mb-4 h-10 w-10 text-primary" strokeWidth={1.5} />
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.packagesLabel}</p>
          </div>
          <div className="space-y-4">
            <div className="border border-border bg-surface p-6">
              <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.ts}</span>
              <a
                href="https://www.npmjs.com/package/prova-agent-sdk"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 flex items-center gap-1.5 font-mono text-sm break-all text-foreground hover:text-primary"
              >
                npmjs.com/package/prova-agent-sdk
                <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
              </a>
              <pre className="mt-4 overflow-x-auto font-mono text-xs text-muted-foreground">npm install prova-agent-sdk</pre>
            </div>
            
            <div className="border border-border bg-surface p-6">
              <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.rs}</span>
              <a
                href="https://crates.io/crates/prova-agent-sdk"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 flex items-center gap-1.5 font-mono text-sm break-all text-foreground hover:text-primary"
              >
                crates.io/crates/prova-agent-sdk
                <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
              </a>
              <pre className="mt-4 overflow-x-auto font-mono text-xs text-muted-foreground">cargo add prova-agent-sdk</pre>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.docsLabel}</p>
          </div>
          <div>
            <Button asChild className="font-mono uppercase tracking-wider">
              <Link href="/developers/sdks">{t.getStarted}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
