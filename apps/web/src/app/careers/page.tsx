import type { Metadata } from 'next';
import { Button } from '@prova/ui';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Careers', description: 'Join the Prova team.' };

const openings = [
  { title: 'Senior Solana Engineer', type: 'Full-time', location: 'Remote', req: ['5+ years Rust', 'Anchor/Solana program experience', 'Security mindset'] },
  { title: 'Frontend Engineer', type: 'Full-time', location: 'Remote', req: ['Next.js 15 / React 19', 'TypeScript', 'Tailwind CSS'] },
  { title: 'Developer Relations', type: 'Full-time', location: 'Remote', req: ['Technical writing', 'Community building', 'Solana ecosystem knowledge'] },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white">Careers</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We are building the trust infrastructure for the agentic internet. Join us.
        </p>
        <div className="mt-12 space-y-6">
          {openings.map((o) => (
            <div key={o.title} className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{o.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{o.type} · {o.location}</p>
                </div>
                <Button size="sm" asChild>
                  <Link href={`mailto:jobs@prova.io?subject=${encodeURIComponent(o.title)}`}>Apply</Link>
                </Button>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {o.req.map((r) => (
                  <li key={r} className="rounded border border-border px-2 py-1 text-xs text-muted-foreground">{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
