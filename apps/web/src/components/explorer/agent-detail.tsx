'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, AlertTriangle, ShieldOff, KeyRound, RefreshCw } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@prova/ui';
import { useAgentAccount, useAgentAttestations } from '@/lib/solana/hooks';
import { ACTION_TYPE_LABEL, shortPubkey } from '@/lib/solana/events';
import { explorerAccountUrl, NETWORK } from '@/lib/solana/constants';
import { ForensicExport } from './forensic-export';
import { useI18n } from '../i18n-provider';
import { PublicKey } from '@solana/web3.js';

function bytesToHex(b: Uint8Array): string {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

function formatTs(unix: number): string {
  if (!unix) return '—';
  return new Date(unix * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

const content = {
  EN: {
    back: 'Back to Explorer',
    agent: 'Agent',
    resolving: 'Resolving agent account…',
    status: 'Status',
    revoked: 'revoked',
    active: 'active',
    attsIssued: 'Attestations issued',
    registered: 'Registered',
    accAddress: 'Account address (PDA)',
    operator: 'Operator',
    agentId: 'Agent ID (Ed25519 pubkey)',
    policyRoot: 'Policy root (merkle)',
    attHistory: 'Attestation history',
    loadingAtts: 'Loading attestations…',
    noAtts: 'This agent has not issued any attestations yet.',
    slot: 'slot'
  },
  ES: {
    back: 'Volver al Explorador',
    agent: 'Agente',
    resolving: 'Resolviendo cuenta del agente…',
    status: 'Estado',
    revoked: 'revocado',
    active: 'activo',
    attsIssued: 'Atestaciones emitidas',
    registered: 'Registrado',
    accAddress: 'Dirección de la cuenta (PDA)',
    operator: 'Operador',
    agentId: 'ID del agente (pubkey Ed25519)',
    policyRoot: 'Raíz de política (merkle)',
    attHistory: 'Historial de atestaciones',
    loadingAtts: 'Cargando atestaciones…',
    noAtts: 'Este agente no ha emitido ninguna atestación todavía.',
    slot: 'slot'
  },
  ZH: {
    back: '返回浏览器',
    agent: '代理',
    resolving: '正在解析代理账户…',
    status: '状态',
    revoked: '已撤销',
    active: '活跃',
    attsIssued: '已发出的证明',
    registered: '注册时间',
    accAddress: '账户地址 (PDA)',
    operator: '操作员',
    agentId: '代理 ID (Ed25519 公钥)',
    policyRoot: '策略根 (merkle)',
    attHistory: '证明历史',
    loadingAtts: '正在加载证明…',
    noAtts: '此代理尚未发出任何证明。',
    slot: '区块'
  }
};

export function AgentDetail({ pubkey }: { pubkey: string }) {
  const { lang } = useI18n();
  const t = content[lang];
  const wallet = useWallet();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useAgentAccount(pubkey);
  const { attestations, loading: attsLoading } = useAgentAttestations(data?.address ?? null, 50, refreshKey);

  const isOperator = !!data && !!wallet.publicKey && wallet.publicKey.equals(data.operator);

  return (
    <div className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/explorer"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.back}
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.agent}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{NETWORK}</p>
          </div>
          <div>
            <h1 className="break-all font-display text-2xl uppercase leading-none text-foreground sm:text-4xl">
              {pubkey.slice(0, 8)}…{pubkey.slice(-8)}
            </h1>
            <p className="mt-4 break-all font-mono text-xs text-muted-foreground">{pubkey}</p>
          </div>
        </div>

        {loading && (
          <div className="mt-16 flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.resolving}
          </div>
        )}

        {error && (
          <div className="mt-16 flex items-center gap-3 border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {data && (
          <>
            <dl className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
              <Field label={t.status}>
                {data.revoked ? (
                  <span className="inline-flex items-center gap-1.5 text-destructive">
                    <ShieldOff className="h-4 w-4" strokeWidth={1.5} /> {t.revoked}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <CheckCircle className="h-4 w-4" strokeWidth={1.5} /> {t.active}
                  </span>
                )}
              </Field>
              <Field label={t.attsIssued}>
                <span className="font-display text-2xl uppercase tabular-nums text-foreground">
                  {data.attestationCount.toLocaleString()}
                </span>
              </Field>
              <Field label={t.registered}>{formatTs(data.createdAt)}</Field>

              <Field label={t.accAddress} className="md:col-span-3">
                <a
                  href={explorerAccountUrl(data.address.toBase58())}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="break-all font-mono text-xs text-foreground hover:text-primary"
                >
                  {data.address.toBase58()}
                </a>
              </Field>
              <Field label={t.operator}>
                <a
                  href={explorerAccountUrl(data.operator.toBase58())}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="break-all font-mono text-xs text-foreground hover:text-primary"
                >
                  {data.operator.toBase58()}
                </a>
              </Field>
              <Field label={t.agentId}>
                <span className="break-all font-mono text-xs text-foreground">{bytesToHex(data.agentId)}</span>
              </Field>
              <Field label={t.policyRoot}>
                <span className="break-all font-mono text-xs text-foreground">{bytesToHex(data.policyRoot)}</span>
              </Field>
            </dl>

            <div className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-xl uppercase text-foreground sm:text-3xl">
                  {t.attHistory}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  {isOperator && !data.revoked && (
                    <Button asChild size="sm" className="gap-2 font-mono text-xs uppercase tracking-wider">
                      <Link href="/app/issue">
                        <KeyRound className="h-3.5 w-3.5" />
                        Issue attestation
                      </Link>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setRefreshKey((k) => k + 1)}
                    disabled={attsLoading}
                    className="gap-1.5 font-mono text-xs uppercase tracking-wider"
                  >
                    <RefreshCw className={`h-3 w-3 ${attsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <ForensicExport
                    resourceId={`agent:${data.address.toBase58()}`}
                    resourceLabel={`${t.agent} ${shortPubkey(data.address, 4, 4)} — ${data.attestationCount} attestations`}
                    printPath={`/explorer/agent/${encodeURIComponent(data.address.toBase58())}/report`}
                  />
                </div>
              </div>

              {attsLoading ? (
                <div className="mt-6 flex items-center justify-center gap-3 border border-border bg-background py-16 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.loadingAtts}
                </div>
              ) : attestations.length === 0 ? (
                <div className="mt-6 border border-border bg-background px-5 py-12 text-center">
                  {data.attestationCount > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {data.attestationCount} attestation{data.attestationCount !== 1 ? 's' : ''} recorded on-chain — event log not yet indexed.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRefreshKey((k) => k + 1)}
                          className="gap-1.5 font-mono text-xs uppercase tracking-wider"
                        >
                          <RefreshCw className="h-3 w-3" /> Retry
                        </Button>
                        <a
                          href={explorerAccountUrl(data.address.toBase58())}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-mono text-xs text-muted-foreground underline hover:text-foreground"
                        >
                          View on Solana Explorer ↗
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t.noAtts}</p>
                  )}
                </div>
              ) : (
                <ol className="mt-6 divide-y divide-border border border-border bg-background">
                  {attestations.map((a) => (
                    <li
                      key={`${a.txSignature}-${bytesToHex(a.actionHash)}`}
                      className="grid gap-3 px-4 sm:px-5 py-4 text-sm sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-6"
                    >
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">{t.slot} {a.slot}</span>
                      <Link
                        href={`/explorer/tx/${encodeURIComponent(a.txSignature)}`}
                        className="font-mono text-xs text-foreground hover:text-primary"
                      >
                        {a.txSignature.slice(0, 8)}…{a.txSignature.slice(-4)}
                      </Link>
                      <span className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">
                        {ACTION_TYPE_LABEL[a.actionType]}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">{formatTs(a.timestamp)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-background p-6 ${className ?? ''}`}>
      <dt className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}
