'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const posts = [
  {
    title: 'Why the Agentic Economy Needs Behavior Attestations',
    date: '2026-05-08',
    category: 'Industry',
    slug: 'why-attestations',
    readTime: '6 min',
  },
  {
    title: 'Building on Solana Attestation Service: A Technical Deep-Dive',
    date: '2026-05-05',
    category: 'Engineering',
    slug: 'sas-deep-dive',
    readTime: '10 min',
  },
  {
    title: 'MetaComp KYA Framework: What AI Agent Operators Need to Know',
    date: '2026-05-01',
    category: 'Compliance',
    slug: 'metacomp-kya',
    readTime: '8 min',
  },
];

const content = {
  EN: {
    tag: 'Blog',
    headline: ['Engineering,', 'product & industry.'],
    read: 'read',
  },
  ES: {
    tag: 'Blog',
    headline: ['Ingeniería,', 'producto e industria.'],
    read: 'lectura',
  },
  ZH: {
    tag: '博客',
    headline: ['工程、', '产品与行业。'],
    read: '分钟阅读',
  },
};

export default function BlogPage() {
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
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-border">
              <Link
                href={`/blog/${p.slug}`}
                className="group grid gap-4 py-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-12 lg:py-12"
              >
                <span className="font-pixel text-[11px] uppercase tracking-wider text-primary">
                  {p.category}
                </span>
                <div>
                  <h2 className="font-display text-xl uppercase text-foreground group-hover:text-primary lg:text-2xl">
                    {p.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {p.date} · {p.readTime} {t.read}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
