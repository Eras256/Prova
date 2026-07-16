'use client';

import { useI18n } from '@/components/i18n-provider';

const releases = [
  {
    version: '0.2.2',
    date: '2026-07-16',
    type: 'Feature',
    notes: [
      'Official MCP server — prova-mcp-server on npm: Claude, Cursor & any MCP client can query verified attestations natively',
      '9 MCP tools: stats, attestation queries, agent stats, local SHA-256 hash verification, premium forensics',
      'Official elizaOS plugin — prova-plugin-eliza on npm: wraps every eliza action with an on-chain receipt (debounced batching, fire-and-forget)',
      'Live try-it console at /developers/api — run real requests against the production API from the browser',
      'New documentation section at /developers/docs — 9 pages (EN/ES/ZH) with responsive sidebar: concepts, SDK references, REST API, on-chain program',
      'Docs entry added to the main navigation',
      'API & MCP reference updated with the real npx setup for Claude Code, Claude Desktop and Cursor',
      'Anchor CPI example corrected to the real record_attestations interface; storage-model copy fixed in quick-start',
    ],
  },
  {
    version: '0.2.1',
    date: '2026-07-15',
    type: 'Infrastructure',
    notes: [
      'Custom domain — theprova.xyz is the new canonical home',
      'prova-agent-sdk@0.1.7 and prova-agent-kit@0.1.3 published to npm',
      'Rust SDK 0.1.1 published to crates.io',
      'Indexer hardened: full paginated backfill, periodic catch-up, WebSocket watchdog, honest health checks with self-restart',
      'Backfilled 26,000+ attestations after re-pointing the indexer to the main program',
      'Blinks endpoint, sitemap and quick-start snippets now resolve to theprova.xyz',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-05-12',
    type: 'Major',
    notes: [
      'Production Devnet Release — 100% real on-chain interactions',
      'Rust SDK published to crates.io (prova-agent-sdk v0.1.0)',
      'New Solutions portal: Compliance, Legal, Auditors',
      'New Developers portal: API & MCP Reference, Examples',
      'Unified JARGUS internal audit disclaimers across all endpoints',
      'Removed all demo-mode stubs from frontend and SDK',
    ],
  },
  {
    version: '0.1.6',
    date: '2026-05-11',
    type: 'Feature',
    notes: [
      'Solana Actions / Blinks endpoint — share any receipt as a Blink on Twitter/X',
      'API Keys self-service UI at /app/api-keys (Privy JWT-gated)',
      'x402 on-chain payment verification (real tx check, replay protection)',
      'RPC proxy at /api/rpc — Helius API key no longer exposed in browser bundle',
      'Jupiter/DeFi attestation pattern added to quick-start (step 06)',
      'register-agent.tsx fully translated EN/ES/ZH',
      'Overview dashboard and API-keys page translated EN/ES/ZH',
      'CI: Anchor tests now block on failure (removed continue-on-error)',
    ],
  },
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
      'Forensic Explorer (beta)',
      'Hono REST API deployed on Fly.io',
      'Helius polling indexer',
      'Register Agent + Issue Attestation UI',
      'Three-language support: EN / ES / ZH',
    ],
  },
];

const content = {
  EN: {
    tag: 'Changelog',
    headline: ['What shipped.', 'When it shipped.'],
  },
  ES: {
    tag: 'Changelog',
    headline: ['Qué se desplegó.', 'Cuándo se desplegó.'],
  },
  ZH: {
    tag: '更新日志',
    headline: ['已发布的内容。', '发布时间。'],
  },
};

export default function ChangelogPage() {
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
          {releases.map((r) => (
            <li
              key={r.version}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-[auto_1fr] lg:gap-16 lg:py-12"
            >
              <div className="min-w-[130px]">
                <p className="font-display text-xl uppercase text-foreground">v{r.version}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{r.date}</p>
                <span className="mt-2 inline-block border border-primary/40 px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-primary">
                  {r.type}
                </span>
              </div>
              <ul className="space-y-2">
                {r.notes.map((n) => (
                  <li key={n} className="flex items-baseline gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 text-primary" aria-hidden>+</span>
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
