import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { ArrowRight, Github, BookOpen, Code2, Puzzle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developers — ship your first attestation in 2 minutes',
  description:
    'TypeScript and Rust SDKs, full REST API, copy-paste examples. Everything you need to wrap an AI agent action in a signed, on-chain receipt.',
  alternates: { canonical: '/developers' },
};

const resources = [
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
    title: 'API reference',
    desc: 'Every endpoint, with a try-it console powered by your own key.',
    href: '/developers/api',
    cta: 'Browse API',
  },
  {
    n: '03',
    icon: Puzzle,
    title: 'SDK reference',
    desc: 'TypeScript and Rust. Same primitives, same guarantees.',
    href: '/developers/sdks',
    cta: 'View SDKs',
  },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Developers</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">Wrap an agent action.</span>
              <span className="mt-2 block text-muted-foreground">Get a receipt that</span>
              <span className="block text-muted-foreground">survives anything.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Free, open-source SDKs for TypeScript and Rust. No proprietary runtime, no vendor lock-in — a thin wrapper around the Solana Attestation Service.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/developers/quick-start">Open the Quick Start</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <a href="https://github.com/prova-io/prova" target="_blank" rel="noreferrer noopener">
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {resources.map((r) => (
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
          <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">Install</p>
          <h2 className="mt-3 font-display text-xl uppercase text-foreground sm:text-3xl">
            Same surface across both stacks.
          </h2>
          <div className="mt-8 grid gap-px bg-border md:grid-cols-2">
            <div className="bg-background p-6">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">TypeScript / JavaScript</span>
                <span className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">Node 18+</span>
              </div>
              <pre className="mt-3 font-mono text-sm text-foreground">pnpm add @prova/sdk</pre>
            </div>
            <div className="bg-background p-6">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">Rust</span>
                <span className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">1.75+</span>
              </div>
              <pre className="mt-3 font-mono text-sm text-foreground">{'prova-sdk = "0.1"'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
