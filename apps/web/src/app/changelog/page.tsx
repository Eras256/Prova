import type { Metadata } from 'next';
import { Badge } from '@prova/ui';

export const metadata: Metadata = { title: 'Changelog', description: 'Product updates and release notes.' };

const releases = [
  { version: '0.1.0', date: '2026-05-08', type: 'Initial Release', notes: ['Anchor program on devnet', 'TypeScript SDK (@prova/sdk)', 'Rust SDK (prova-sdk)', 'Forensic Explorer (beta)', 'Hono REST API', 'Helius LaserStream indexer'] },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white">Changelog</h1>
        <div className="mt-12 space-y-10">
          {releases.map((r) => (
            <div key={r.version}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold text-white">v{r.version}</span>
                <Badge variant="success">{r.type}</Badge>
                <span className="text-sm text-muted-foreground">{r.date}</span>
              </div>
              <ul className="mt-4 space-y-1 pl-4">
                {r.notes.map((n) => (
                  <li key={n} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-secondary">+</span> {n}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
