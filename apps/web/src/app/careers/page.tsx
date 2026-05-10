import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers — Prova',
  description: 'Join the Prova team.',
};

const openings = [
  {
    title: 'Senior Solana Engineer',
    type: 'Full-time',
    location: 'Remote',
    req: ['5+ years Rust', 'Anchor/Solana program experience', 'Security mindset'],
  },
  {
    title: 'Frontend Engineer',
    type: 'Full-time',
    location: 'Remote',
    req: ['Next.js 15 / React 19', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'Developer Relations',
    type: 'Full-time',
    location: 'Remote',
    req: ['Technical writing', 'Community building', 'Solana ecosystem knowledge'],
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Careers</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              Build the trust layer<br />
              <span className="text-muted-foreground">for the agentic internet.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We are a small, focused team working on infrastructure that matters. Remote-first, async-friendly.
            </p>
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {openings.map((o) => (
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
                Apply →
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
