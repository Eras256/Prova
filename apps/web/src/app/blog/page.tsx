import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — Prova',
  description: 'Engineering, product, and industry updates from Prova.',
};

const posts = [
  { title: 'Why the Agentic Economy Needs Behavior Attestations', date: '2026-05-08', category: 'Industry', slug: 'why-attestations', readTime: '6 min read' },
  { title: 'Building on Solana Attestation Service: A Technical Deep-Dive', date: '2026-05-05', category: 'Engineering', slug: 'sas-deep-dive', readTime: '10 min read' },
  { title: 'MetaComp KYA Framework: What AI Agent Operators Need to Know', date: '2026-05-01', category: 'Compliance', slug: 'metacomp-kya', readTime: '8 min read' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Blog</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              Engineering,<br />
              <span className="text-muted-foreground">product & industry.</span>
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
                <span className="font-pixel text-[11px] uppercase tracking-wider text-primary">{p.category}</span>
                <div>
                  <h2 className="font-display text-xl uppercase text-foreground group-hover:text-primary lg:text-2xl">
                    {p.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{p.date} · {p.readTime}</p>
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
