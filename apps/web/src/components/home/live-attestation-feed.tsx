'use client';

import { useEffect, useState } from 'react';

type Entry = {
  id: string;
  agent: string;
  schema: string;
  action: string;
  amount?: string;
  ts: number;
};

const SCHEMAS = ['transaction.swap', 'transaction.transfer', 'tool.call', 'decision.kya', 'transaction.lend'];
const ACTIONS = ['swap USDC→SOL', 'transfer to vault', 'gpt-5 tool: search', 'KYA review pass', 'deposit JitoSOL'];
const AGENTS = [
  'agnt_4Kf9...x2pQ',
  'agnt_qZ8m...nT3R',
  'agnt_LpW2...c7Hk',
  'agnt_7vNq...M9dL',
  'agnt_bA3X...rE4y',
  'agnt_h6Tj...uV1B',
  'agnt_w0cF...2KdN',
];

function shortHash(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  const left = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const right = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `att_${left}...${right}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function formatRel(ts: number, now: number): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function seed(): Entry[] {
  const base = Date.now();
  return Array.from({ length: 5 }, (_, i) => {
    const idx = Math.floor(Math.random() * SCHEMAS.length);
    return {
      id: shortHash(),
      agent: pick(AGENTS),
      schema: SCHEMAS[idx]!,
      action: ACTIONS[idx]!,
      amount: idx === 0 || idx === 4 ? `$${(Math.random() * 5000 + 100).toFixed(0)}` : undefined,
      ts: base - i * (3000 + Math.random() * 4000),
    };
  });
}

export function LiveAttestationFeed() {
  const [entries, setEntries] = useState<Entry[]>(() => seed());
  const [now, setNow] = useState<number>(() => Date.now());
  const [counter, setCounter] = useState(10247);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const push = setInterval(() => {
      const idx = Math.floor(Math.random() * SCHEMAS.length);
      const next: Entry = {
        id: shortHash(),
        agent: pick(AGENTS),
        schema: SCHEMAS[idx]!,
        action: ACTIONS[idx]!,
        amount: idx === 0 || idx === 4 ? `$${(Math.random() * 5000 + 100).toFixed(0)}` : undefined,
        ts: Date.now(),
      };
      setEntries((prev) => [next, ...prev].slice(0, 5));
      setCounter((c) => c + 1);
    }, 4200);
    return () => clearInterval(push);
  }, []);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden border border-border bg-surface shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-pixel text-[13px] uppercase tracking-wider text-foreground">Live attestations</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            <span className="text-foreground tabular-nums">{counter.toLocaleString()}</span> total
          </span>
        </div>

        <ol className="divide-y divide-border">
          {entries.map((e) => (
            <li
              key={e.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5 text-sm animate-fade-in"
            >
              <span className="font-mono text-xs text-primary">{e.id}</span>
              <div className="min-w-0">
                <div className="truncate text-foreground">{e.action}</div>
                <div className="mt-0.5 flex items-center gap-2 truncate font-mono text-[11px] text-muted-foreground">
                  <span className="truncate">{e.agent}</span>
                  <span className="text-border">·</span>
                  <span>{e.schema}</span>
                  {e.amount && (
                    <>
                      <span className="text-border">·</span>
                      <span className="text-foreground/80">{e.amount}</span>
                    </>
                  )}
                </div>
              </div>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                {formatRel(e.ts, now)}
              </span>
            </li>
          ))}
        </ol>

        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span className="font-mono">solana.devnet · sas.program</span>
          <a href="/explorer" className="text-primary transition-colors hover:text-foreground">
            Open Explorer →
          </a>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute -inset-x-3 -inset-y-3 -z-10 border border-border/40" />
    </div>
  );
}
