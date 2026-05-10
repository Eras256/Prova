import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — Prova',
  description: 'Product updates and release notes.',
};

const releases = [
  {
    version: '0.1.5',
    date: '2026-05-09',
    type: 'SDK Update',
    notes: [
      'prova-agent-sdk@0.1.5 published to npm',
      'Added ProvaApiClient — full HTTP client for the REST API',
      'New /developers/sdks reference page (EN / ES / ZH)',
      'Updated quick-start guide with ProvaApiClient usage',
      'Admin API key endpoint (POST /api/v1/admin/api-keys)',
      'Indexer added to CI/CD pipeline',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-05-08',
    type: 'Initial Release',
    notes: [
      'Anchor program deployed on devnet',
      'TypeScript SDK — prova-agent-sdk on npm',
      'Rust SDK — prova-sdk on crates.io',
      'Forensic Explorer (beta)',
      'Hono REST API deployed on Fly.io',
      'Helius polling indexer',
      'Register Agent + Issue Attestation UI',
      'Three-language support: EN / ES / ZH',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Changelog</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              What shipped.<br />
              <span className="text-muted-foreground">When it shipped.</span>
            </h1>
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {releases.map((r) => (
            <li key={r.version} className="grid gap-6 border-b border-border py-10 lg:grid-cols-[auto_1fr] lg:gap-16 lg:py-12">
              <div className="min-w-[120px]">
                <p className="font-display text-xl uppercase text-foreground">v{r.version}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{r.date}</p>
                <span className="mt-2 inline-block border border-primary/40 px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-primary">
                  {r.type}
                </span>
              </div>
              <ul className="space-y-2">
                {r.notes.map((n) => (
                  <li key={n} className="flex items-baseline gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 text-primary">+</span>
                    {n}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
