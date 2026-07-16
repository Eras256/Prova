'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLiveAttestations } from '@/lib/solana/hooks';
import { ACTION_TYPE_LABEL, shortPubkey, shortBytes, type AttestationIssued } from '@/lib/solana/events';
import { useI18n } from '../i18n-provider';

const API_URL = process.env.NEXT_PUBLIC_PROVA_API_URL ?? 'https://prova-api.fly.dev';

type Entry = {
  id: string;
  agent: string;
  schema: string;
  action: string;
  ts: number;
  txSignature?: string;
};

interface ApiAttestation {
  pda: string;
  agentPda: string;
  actionType: string;
  actionHash: string;
  timestamp: string;
  privacyMode: boolean;
}

interface ApiResponse {
  data: ApiAttestation[];
  pagination: { total: number };
}

function liveToEntry(a: AttestationIssued & { txSignature: string }): Entry {
  return {
    id: `att_${shortBytes(a.actionHash, 4, 4)}`,
    agent: shortPubkey(a.agent, 4, 4),
    schema: ACTION_TYPE_LABEL[a.actionType].toLowerCase().replace(/\s+/g, '.'),
    action: a.privacyMode ? `${ACTION_TYPE_LABEL[a.actionType]} (vanish)` : ACTION_TYPE_LABEL[a.actionType],
    ts: a.timestamp ? a.timestamp * 1000 : Date.now(),
    txSignature: a.txSignature,
  };
}

function apiToEntry(a: ApiAttestation): Entry {
  const label = a.actionType.charAt(0).toUpperCase() + a.actionType.slice(1);
  return {
    id: `att_${a.actionHash.slice(0, 4)}…${a.actionHash.slice(-4)}`,
    agent: `${a.agentPda.slice(0, 4)}…${a.agentPda.slice(-4)}`,
    schema: a.actionType.toLowerCase(),
    action: a.privacyMode ? `${label} (vanish)` : label,
    ts: new Date(a.timestamp).getTime(),
  };
}

function formatRel(ts: number, now: number, t: (k: string) => string): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}${t('sAgo')}`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}${t('mAgo')}`;
  return `${Math.floor(m / 60)}${t('hAgo')}`;
}

export function LiveAttestationFeed() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const { attestations: live, total: liveTotal, connected } = useLiveAttestations(8);
  const [historic, setHistoric] = useState<Entry[]>([]);
  const [historicTotal, setHistoricTotal] = useState(0);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setNow(Date.now());
    setMounted(true);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Cargar atestaciones históricas reales del indexer si no hay actividad live aún.
  useEffect(() => {
    let cancelled = false;
    async function loadHistoric() {
      try {
        const res = await fetch(`${API_URL}/api/v1/attestations?limit=5`);
        if (!res.ok) return;
        const json = (await res.json()) as ApiResponse;
        if (cancelled) return;
        setHistoric(json.data.map(apiToEntry));
        setHistoricTotal(json.pagination.total);
      } catch {
        // Sin datos: mostramos empty state honesto.
      }
    }
    loadHistoric();
    // Refrescar cada 30s para mantener histórico actualizado.
    const refresh = setInterval(loadHistoric, 30_000);
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, []);

  const entries: Entry[] = useMemo(() => {
    if (!mounted) return [];
    if (live.length > 0) return live.map(liveToEntry).slice(0, 5);
    return historic.slice(0, 5);
  }, [mounted, live, historic]);

  const showingLive = mounted && live.length > 0;
  const counter = showingLive ? liveTotal : historicTotal;
  const counterLabel = showingLive ? t('liveOnDevnet') : t('awaitingActivity');
  const isEmpty = mounted && entries.length === 0;

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
          {!mounted && Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-5 py-3.5 text-sm">
              <span className="font-mono text-xs text-transparent select-none">att_0000…0000</span>
              <div className="min-w-0 flex flex-col justify-center gap-1.5 py-0.5">
                <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
                <div className="h-3 w-48 bg-muted/30 rounded animate-pulse" />
              </div>
              <span className="shrink-0 font-mono text-[11px] text-transparent select-none">0s ago</span>
            </li>
          ))}

          {mounted && isEmpty && (
            <li className="px-5 py-12 text-center font-mono text-xs text-muted-foreground">
              {t('noAttestationsYet')}
            </li>
          )}

          {mounted && entries.map((e) => (
            <li
              key={`${e.id}-${e.ts}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-5 py-3.5 text-sm animate-fade-in"
            >
              <Link
                href={e.txSignature ? `/explorer/tx/${e.txSignature}` : '/explorer'}
                className="font-mono text-xs text-primary hover:underline"
              >
                {e.id}
              </Link>
              <div className="min-w-0">
                <div className="truncate text-foreground">{e.action}</div>
                <div className="mt-0.5 flex items-center gap-2 truncate font-mono text-[11px] text-muted-foreground">
                  <span className="truncate">{e.agent}</span>
                  <span className="text-border">·</span>
                  <span>{e.schema}</span>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                {formatRel(e.ts, now, t)}
              </span>
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
