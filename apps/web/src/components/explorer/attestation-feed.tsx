'use client';

import Link from 'next/link';
import { CheckCircle, Loader2, Inbox, AlertTriangle } from 'lucide-react';
import { useRecentAttestations } from '@/lib/solana/hooks';
import { ACTION_TYPE_LABEL, shortPubkey, shortBytes } from '@/lib/solana/events';
import { explorerTxUrl, NETWORK } from '@/lib/solana/constants';
import { useI18n } from '../i18n-provider';

function formatTs(unix: number): string {
  if (!unix) return '—';
  return new Date(unix * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

const content = {
  EN: {
    title: 'Recent attestations',
    onThisPage: 'on this page',
    rpcError: 'RPC error:',
    querying: 'Querying devnet…',
    noAttestations: 'No attestations yet',
    noAttestationsDesc: 'The program is live on devnet but no agent has issued an attestation yet. Run the SDK quickstart to push the first one.',
    openQuickstart: 'Open quickstart →',
    slot: 'slot',
    agent: 'agent',
    hash: 'hash',
    vanish: 'vanish',
    verified: 'verified'
  },
  ES: {
    title: 'Atestaciones recientes',
    onThisPage: 'en esta página',
    rpcError: 'Error RPC:',
    querying: 'Consultando devnet…',
    noAttestations: 'Sin atestaciones aún',
    noAttestationsDesc: 'El programa está en vivo en devnet pero ningún agente ha emitido atestaciones todavía. Ejecuta el inicio rápido del SDK para enviar la primera.',
    openQuickstart: 'Abrir inicio rápido →',
    slot: 'slot',
    agent: 'agente',
    hash: 'hash',
    vanish: 'vanish',
    verified: 'verificado'
  },
  ZH: {
    title: '最近的证明',
    onThisPage: '在本页',
    rpcError: 'RPC 错误：',
    querying: '正在查询 devnet…',
    noAttestations: '暂无证明',
    noAttestationsDesc: '该程序已在 devnet 上线，但尚未有代理发出证明。运行 SDK 快速入门以推送第一个。',
    openQuickstart: '打开快速入门 →',
    slot: '区块',
    agent: '代理',
    hash: '哈希',
    vanish: 'vanish',
    verified: '已验证'
  }
};

export function AttestationFeed() {
  const { lang } = useI18n();
  const t = content[lang];
  const { attestations, loading, error } = useRecentAttestations(50);

  return (
    <div className="border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="font-pixel text-[13px] uppercase tracking-wider text-foreground">{t.title}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{NETWORK}</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {loading ? '…' : `${attestations.length} ${t.onThisPage}`}
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-3 border-b border-border bg-destructive/5 px-5 py-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{t.rpcError} {error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.querying}
        </div>
      ) : attestations.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-20 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="font-display text-base uppercase text-foreground">{t.noAttestations}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {t.noAttestationsDesc}
          </p>
          <Link
            href="/developers/quick-start"
            className="mt-2 font-mono text-xs uppercase tracking-wider text-primary hover:underline"
          >
            {t.openQuickstart}
          </Link>
        </div>
      ) : (
        <ol className="divide-y divide-border">
          {attestations.map((a) => (
            <li
              key={`${a.txSignature}-${shortBytes(a.actionHash)}`}
              className="grid gap-3 px-5 py-4 text-sm sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-6"
            >
              <span className="font-mono text-xs text-muted-foreground tabular-nums">{t.slot} {a.slot}</span>

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <a
                  href={explorerTxUrl(a.txSignature)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-foreground hover:text-primary"
                >
                  {a.txSignature.slice(0, 8)}…{a.txSignature.slice(-4)}
                </a>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {t.agent} <span className="text-foreground">{shortPubkey(a.agent, 4, 4)}</span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {t.hash} <span className="text-foreground">{shortBytes(a.actionHash, 4, 4)}</span>
                </span>
                {a.privacyMode && (
                  <span className="font-pixel text-[10px] uppercase tracking-wider text-primary">{t.vanish}</span>
                )}
              </div>

              <span className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">
                {ACTION_TYPE_LABEL[a.actionType]}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-primary">
                <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="font-mono uppercase tracking-wider">{t.verified}</span>
                <span className="hidden text-muted-foreground sm:inline"> · {formatTs(a.timestamp)}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
