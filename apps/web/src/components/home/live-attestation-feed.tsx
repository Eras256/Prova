'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLiveAttestations } from '@/lib/solana/hooks';
import { ACTION_TYPE_LABEL, shortPubkey, shortBytes, type AttestationIssued } from '@/lib/solana/events';
import { useI18n } from '../i18n-provider';

type Entry = {
  id: string;
  agent: string;
  schema: string;
  action: string;
  amount?: string;
  ts: number;
  source: 'live' | 'demo';
};

const SCHEMAS = ['transaction.swap', 'transaction.transfer', 'tool.call', 'decision.kya', 'transaction.lend'];
const ACTIONS = ['swap USDC→SOL', 'transfer to vault', 'gpt-5 tool: search', 'KYA review pass', 'deposit JitoSOL'];
const AGENTS = [
  'agnt_4Kf9...x2pQ',
  'agnt_qZ8m...nT3R',
  'agnt_LpW2...c7Hk',
  'agnt_7vNq...M9dL',
  'agnt_bA3X...rE4y',
];

function shortHash(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  const left = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const right = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `att_${left}…${right}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function formatRel(ts: number, now: number, t: (k: string) => string): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}${t('sAgo')}`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}${t('mAgo')}`;
  return `${Math.floor(m / 60)}${t('hAgo')}`;
}

function seedDemo(): Entry[] {
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
      source: 'demo',
    };
  });
}

function liveToEntry(a: AttestationIssued): Entry {
  return {
    id: `att_${shortBytes(a.actionHash, 4, 4)}`,
    agent: shortPubkey(a.agent, 4, 4),
    schema: ACTION_TYPE_LABEL[a.actionType].toLowerCase().replace(/\s+/g, '.'),
    action: a.privacyMode ? `${ACTION_TYPE_LABEL[a.actionType]} (vanish)` : ACTION_TYPE_LABEL[a.actionType],
    ts: a.timestamp ? a.timestamp * 1000 : Date.now(),
    source: 'live',
  };
}

export function LiveAttestationFeed() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const { attestations: live, total: liveTotal, connected } = useLiveAttestations(8);
  const [demo, setDemo] = useState<Entry[]>([]);
  const [now, setNow] = useState<number>(0);
  const [demoCounter, setDemoCounter] = useState(10247);

  useEffect(() => {
    setDemo(seedDemo());
    setNow(Date.now());
    setMounted(true);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Mantener un demo en marcha sólo si no hay datos reales todavía
  useEffect(() => {
    if (!mounted || live.length > 0) return;
    const push = setInterval(() => {
      const idx = Math.floor(Math.random() * SCHEMAS.length);
      const next: Entry = {
        id: shortHash(),
        agent: pick(AGENTS),
        schema: SCHEMAS[idx]!,
        action: ACTIONS[idx]!,
        amount: idx === 0 || idx === 4 ? `$${(Math.random() * 5000 + 100).toFixed(0)}` : undefined,
        ts: Date.now(),
        source: 'demo',
      };
      setDemo((prev) => [next, ...prev].slice(0, 5));
      setDemoCounter((c) => c + 1);
    }, 4200);
    return () => clearInterval(push);
  }, [live.length]);

  const entries: Entry[] = useMemo(() => {
    if (!mounted) return [];
    if (live.length > 0) return live.map(liveToEntry).slice(0, 5);
    return demo;
  }, [mounted, live, demo]);

  const showingLive = mounted && live.length > 0;
  const counter = showingLive ? liveTotal : demoCounter;
  const counterLabel = showingLive ? t('liveOnDevnet') : t('demoAwaiting');

  return (
    <div className="relative w-full">
      <div className="overflow-hidden border border-border bg-surface shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden>
              {connected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${connected ? 'bg-primary' : 'bg-muted-foreground'}`}
              />
            </span>
            <span className="font-pixel text-[13px] uppercase tracking-wider text-foreground">{t('liveAttestations')}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            <span className="text-foreground tabular-nums">{counter.toLocaleString()}</span>
            <span className="ml-1.5 hidden sm:inline">{showingLive ? t('thisSession') : t('total')}</span>
          </span>
        </div>

        <ol className="divide-y divide-border">
          {mounted ? entries.map((e) => (
            <li
              key={`${e.id}-${e.ts}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5 text-sm animate-fade-in"
            >
              <span className={`font-mono text-xs ${e.source === 'live' ? 'text-primary' : 'text-muted-foreground'}`}>
                {e.id}
              </span>
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
                {formatRel(e.ts, now, t)}
              </span>
            </li>
          )) : Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5 text-sm">
              <span className="font-mono text-xs text-transparent select-none">att_0000…0000</span>
              <div className="min-w-0 flex flex-col justify-center gap-1.5 py-0.5">
                <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
                <div className="h-3 w-48 bg-muted/30 rounded animate-pulse" />
              </div>
              <span className="shrink-0 font-mono text-[11px] text-transparent select-none">0s ago</span>
            </li>
          ))}
        </ol>

        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span className="font-mono">{counterLabel}</span>
          <a href="/explorer" className="text-primary transition-colors hover:text-foreground">
            {t('openExplorer')}
          </a>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute -inset-x-3 -inset-y-3 -z-10 border border-border/40" />
    </div>
  );
}
