import type { Metadata } from 'next';
import { Badge } from '@prova/ui';

export const metadata: Metadata = { title: 'Blog', description: 'Engineering, product, and industry updates from Prova.' };

const posts = [
  { title: 'Why the Agentic Economy Needs Behavior Attestations', date: '2026-05-08', category: 'Industry', slug: 'why-attestations' },
  { title: 'Building on Solana Attestation Service: A Technical Deep-Dive', date: '2026-05-05', category: 'Engineering', slug: 'sas-deep-dive' },
  { title: 'MetaComp KYA Framework: What AI Agent Operators Need to Know', date: '2026-05-01', category: 'Compliance', slug: 'metacomp-kya' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white">Blog</h1>
        <div className="mt-12 space-y-6">
          {posts.map((p) => (
            <div key={p.slug} className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <Badge variant="secondary">{p.category}</Badge>
                <span className="text-xs text-muted-foreground">{p.date}</span>
              </div>
              <h2 className="text-xl font-semibold text-white">{p.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
