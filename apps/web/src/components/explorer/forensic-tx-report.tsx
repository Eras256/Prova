'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Lock, Printer, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@prova/ui';
import { useTransactionDetail } from '@/lib/solana/hooks';
import { ACTION_TYPE_LABEL } from '@/lib/solana/events';
import { explorerTxUrl, NETWORK } from '@/lib/solana/constants';
import { getReceipt, type X402Receipt } from '@/lib/solana/x402';

function bytesToHex(b: Uint8Array): string {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

function formatTs(unix: number | null | undefined): string {
  if (!unix) return '—';
  return new Date(unix * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

export function ForensicTxReport({ signature }: { signature: string }) {
  const [mounted, setMounted] = useState(false);
  const [receipt, setReceipt] = useState<X402Receipt | null>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    setReceipt(getReceipt(`tx:${signature}`));
  }, [mounted, signature]);

  const { data, loading, error } = useTransactionDetail(signature);

  if (!mounted) return null;

  if (!receipt) {
    return <PaywallGate backHref={`/explorer/tx/${encodeURIComponent(signature)}`} />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8 print:bg-white print:p-0 print:text-black">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between print:hidden">
          <Link
            href={`/explorer/tx/${encodeURIComponent(signature)}`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to transaction
          </Link>
          <Button size="sm" onClick={() => window.print()} className="gap-2 font-mono uppercase tracking-wider">
            <Printer className="h-3.5 w-3.5" />
            Print / save PDF
          </Button>
        </div>

        <header className="mt-10 border-b-2 border-foreground pb-6 print:mt-0 print:border-black">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl uppercase tracking-tight">Prova</span>
            <span className="font-pixel text-[11px] uppercase tracking-wider">Forensic Report</span>
          </div>
          <h1 className="mt-6 font-display text-2xl uppercase leading-tight sm:text-4xl">Transaction receipt</h1>
          <p className="mt-2 break-all font-mono text-xs text-muted-foreground print:text-gray-700">{signature}</p>
        </header>

        {loading && (
          <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading on-chain data…
          </div>
        )}

        {error && (
          <div className="mt-12 flex items-center gap-3 border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {data && (
          <>
            <Section title="Transaction">
              <Pair k="Status" v={data.status === 'success' ? 'success' : `error · ${data.errorMessage}`} />
              <Pair k="Slot" v={data.slot.toLocaleString()} />
              <Pair k="Block time" v={formatTs(data.blockTime)} />
              <Pair k="Network" v={NETWORK} />
              <Pair
                k="Solana Explorer"
                v={
                  <a
                    href={explorerTxUrl(signature)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-primary underline print:text-blue-700"
                  >
                    {explorerTxUrl(signature)}
                  </a>
                }
              />
            </Section>

            <Section title={`Attestations (${data.attestations.length})`}>
              {data.attestations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This transaction touched the Prova program but emitted no AttestationIssued events.
                </p>
              ) : (
                <ol className="space-y-6">
                  {data.attestations.map((a, i) => (
                    <li key={`${bytesToHex(a.actionHash)}-${i}`} className="border border-border print:border-black">
                      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2 print:bg-gray-100 print:border-black">
                        <span className="font-mono text-xs">#{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-pixel text-[11px] uppercase tracking-wider">
                          {ACTION_TYPE_LABEL[a.actionType]}
                        </span>
                      </div>
                      <dl className="divide-y divide-border print:divide-black/20">
                        <Pair k="Agent (PDA)" v={a.agent.toBase58()} mono />
                        <Pair k="Agent ID (Ed25519 pubkey)" v={bytesToHex(a.agentId)} mono />
                        <Pair k="Action hash (sha256)" v={bytesToHex(a.actionHash)} mono />
                        <Pair k="Privacy mode" v={a.privacyMode ? 'vanish (selective disclosure)' : 'disclosed'} />
                        <Pair k="Timestamp" v={formatTs(a.timestamp)} />
                        <Pair k="Ed25519 signature (128 hex chars)" v={bytesToHex(a.signature)} mono />
                      </dl>
                    </li>
                  ))}
                </ol>
              )}
            </Section>
          </>
        )}

        <footer className="mt-16 border-t-2 border-foreground pt-6 text-xs print:border-black">
          <Pair k="Report ID" v={`tx:${signature}`} mono compact />
          <Pair k="Paid" v={`${receipt.amount} lamports · ${formatTs(Math.floor(receipt.paidAt / 1000))}`} compact />
          <Pair k="Receipt tx" v={receipt.txSignature} mono compact />
          <Pair k="Payer" v={receipt.payer} mono compact />
          <p className="mt-6 max-w-prose text-[11px] leading-relaxed text-muted-foreground print:text-gray-700">
            This report is a deterministic export of public on-chain data. Anyone with the transaction signature can
            reproduce its contents. Prova does not custody, gate, or alter the underlying data.
          </p>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 print:mt-8 print:break-inside-avoid">
      <h2 className="font-display text-base uppercase tracking-tight">{title}</h2>
      <div className="mt-4 border border-border print:border-black">{children}</div>
    </section>
  );
}

function Pair({
  k,
  v,
  mono,
  compact,
}: {
  k: string;
  v: React.ReactNode;
  mono?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-1 ${compact ? 'py-1.5' : 'p-4'} sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6`}>
      <dt className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground print:text-gray-600">
        {k}
      </dt>
      <dd className={`break-all text-sm ${mono ? 'font-mono text-xs' : ''}`}>{v}</dd>
    </div>
  );
}

function PaywallGate({ backHref }: { backHref: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md border border-border bg-background p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-2xl uppercase">Report locked</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This forensic report requires an x402 micropayment. Open the transaction page and click{' '}
          <span className="font-mono text-foreground">Export</span> to unlock.
        </p>
        <Link
          href={backHref}
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
      </div>
    </div>
  );
}
