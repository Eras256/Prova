'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Loader2, AlertTriangle, FileDown } from 'lucide-react';
import { useTransactionDetail } from '@/lib/solana/hooks';
import { ACTION_TYPE_LABEL, shortBytes, shortPubkey } from '@/lib/solana/events';
import { explorerTxUrl, explorerAccountUrl, NETWORK } from '@/lib/solana/constants';
import { ForensicExport } from './forensic-export';
import { useI18n } from '../i18n-provider';

function bytesToHex(b: Uint8Array): string {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

function formatTs(unix: number | null): string {
  if (!unix) return '—';
  return new Date(unix * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

const content = {
  EN: {
    back: 'Back to Explorer',
    tx: 'Transaction',
    loading: 'Loading transaction…',
    status: 'Status',
    success: 'success',
    failed: 'failed',
    slot: 'Slot',
    blockTime: 'Block time',
    atts: 'Attestations in this transaction',
    noAtts: 'This transaction touched the Prova program but emitted no AttestationIssued events.',
    agentPDA: 'Agent (PDA)',
    actionType: 'Action type',
    actionHash: 'Action hash',
    agentId: 'Agent ID',
    privacyMode: 'Privacy mode',
    vanish: 'vanish',
    disclosed: 'disclosed',
    timestamp: 'Timestamp',
    ed25519: 'Ed25519 signature',
    openSolana: 'Open on Solana Explorer →',
    backRecent: 'Back to Recent Attestations',
  },
  ES: {
    back: 'Volver al Explorador',
    tx: 'Transacción',
    loading: 'Cargando transacción…',
    status: 'Estado',
    success: 'éxito',
    failed: 'fallido',
    slot: 'Slot',
    blockTime: 'Tiempo de bloque',
    atts: 'Atestaciones en esta transacción',
    noAtts: 'Esta transacción tocó el programa Prova pero no emitió eventos AttestationIssued.',
    agentPDA: 'Agente (PDA)',
    actionType: 'Tipo de acción',
    actionHash: 'Hash de acción',
    agentId: 'ID del agente',
    privacyMode: 'Modo de privacidad',
    vanish: 'vanish',
    disclosed: 'revelado',
    timestamp: 'Marca de tiempo',
    ed25519: 'Firma Ed25519',
    openSolana: 'Abrir en Solana Explorer →',
    backRecent: 'Volver a atestaciones recientes',
  },
  ZH: {
    back: '返回浏览器',
    tx: '交易',
    loading: '正在加载交易…',
    status: '状态',
    success: '成功',
    failed: '失败',
    slot: '区块',
    blockTime: '出块时间',
    atts: '此交易中的证明',
    noAtts: '此交易涉及 Prova 程序，但未发出 AttestationIssued 事件。',
    agentPDA: '代理 (PDA)',
    actionType: '操作类型',
    actionHash: '操作哈希',
    agentId: '代理 ID',
    privacyMode: '隐私模式',
    vanish: 'vanish',
    disclosed: '公开',
    timestamp: '时间戳',
    ed25519: 'Ed25519 签名',
    openSolana: '在 Solana Explorer 中打开 →',
    backRecent: '返回最近的证明',
  }
};

export function TxDetail({ signature }: { signature: string }) {
  const { lang } = useI18n();
  const t = content[lang];
  const { data, loading, error } = useTransactionDetail(signature);

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
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tx}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{NETWORK}</p>
          </div>
          <div>
            <h1 className="break-all font-display text-2xl uppercase leading-none text-foreground sm:text-4xl">
              {signature.slice(0, 12)}…{signature.slice(-8)}
            </h1>
            <p className="mt-4 break-all font-mono text-xs text-muted-foreground">{signature}</p>
          </div>
        </div>

        {loading && (
          <div className="mt-16 flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.loading}
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
                {data.status === 'success' ? (
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <CheckCircle className="h-4 w-4" strokeWidth={1.5} /> {t.success}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-destructive">
                    <XCircle className="h-4 w-4" strokeWidth={1.5} /> {data.errorMessage ?? t.failed}
                  </span>
                )}
              </Field>
              <Field label={t.slot}>
                <span className="font-mono tabular-nums">{data.slot.toLocaleString()}</span>
              </Field>
              <Field label={t.blockTime}>{formatTs(data.blockTime)}</Field>
            </dl>

            <div className="mt-16">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-xl uppercase text-foreground sm:text-3xl">
                  {t.atts}
                </h2>
                <ForensicExport
                  resourceId={`tx:${signature}`}
                  resourceLabel={`${t.tx} ${signature.slice(0, 8)}…${signature.slice(-4)}`}
                  printPath={`/explorer/tx/${encodeURIComponent(signature)}/report`}
                />
              </div>

              {data.attestations.length === 0 ? (
                <p className="mt-6 border border-border bg-background px-5 py-12 text-center text-sm text-muted-foreground">
                  {t.noAtts}
                </p>
              ) : (
                <ol className="mt-6 divide-y divide-border border border-border bg-background">
                  {data.attestations.map((a, i) => (
                    <li key={`${bytesToHex(a.actionHash)}-${i}`} className="grid gap-4 p-6 lg:grid-cols-[auto_1fr] lg:gap-12">
                      <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, '0')}</span>
                      <dl className="grid gap-3 sm:grid-cols-2">
                        <Field label={t.agentPDA} inline>
                          <Link
                            href={`/explorer/agent/${a.agent.toBase58()}`}
                            className="break-all font-mono text-xs text-foreground hover:text-primary"
                          >
                            {a.agent.toBase58()}
                          </Link>
                        </Field>
                        <Field label={t.actionType} inline>
                          <span className="font-pixel text-[11px] uppercase tracking-wider text-foreground">
                            {ACTION_TYPE_LABEL[a.actionType]}
                          </span>
                        </Field>
                        <Field label={t.actionHash} inline>
                          <span className="break-all font-mono text-xs text-foreground">{bytesToHex(a.actionHash)}</span>
                        </Field>
                        <Field label={t.agentId} inline>
                          <span className="break-all font-mono text-xs text-foreground">{bytesToHex(a.agentId)}</span>
                        </Field>
                        <Field label={t.privacyMode} inline>
                          {a.privacyMode ? (
                            <span className="font-pixel text-[11px] uppercase tracking-wider text-primary">{t.vanish}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">{t.disclosed}</span>
                          )}
                        </Field>
                        <Field label={t.timestamp} inline>
                          <span className="font-mono text-xs text-foreground">{formatTs(a.timestamp)}</span>
                        </Field>
                        <Field label={t.ed25519} inline className="sm:col-span-2">
                          <span className="break-all font-mono text-[11px] text-foreground">{bytesToHex(a.signature)}</span>
                        </Field>
                      </dl>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="mt-12 flex flex-wrap gap-3 text-sm">
              <a
                href={explorerTxUrl(signature)}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-xs uppercase tracking-wider text-primary hover:underline"
              >
                {t.openSolana}
              </a>
              <Link
                href="/explorer"
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {t.backRecent}
              </Link>
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
  inline,
  className,
}: {
  label: string;
  children: React.ReactNode;
  inline?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-background ${inline ? '' : 'p-6'} ${className ?? ''}`}>
      <dt className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}
