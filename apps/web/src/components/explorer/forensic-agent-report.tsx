'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Lock, Printer, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@prova/ui';
import { useAgentAccount, useAgentAttestations } from '@/lib/solana/hooks';
import { ACTION_TYPE_LABEL } from '@/lib/solana/events';
import { explorerAccountUrl, NETWORK } from '@/lib/solana/constants';
import { getReceipt, type X402Receipt } from '@/lib/solana/x402';

function bytesToHex(b: Uint8Array): string {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

function formatTs(unix: number): string {
  if (!unix) return '—';
  return new Date(unix * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

export function ForensicAgentReport({ pubkey }: { pubkey: string }) {
  const [mounted, setMounted] = useState(false);
  const [receipt, setReceipt] = useState<X402Receipt | null>(null);
  useEffect(() => setMounted(true), []);

  const { data: agent, loading, error } = useAgentAccount(pubkey);
  const { attestations, loading: attsLoading } = useAgentAttestations(agent?.address ?? null, 100);

  // Buscamos el receipt usando el address del PDA (clave canónica) o el pubkey de entrada
  useEffect(() => {
    if (!mounted) return;
    const candidates = [`agent:${pubkey}`];
    if (agent?.address) candidates.push(`agent:${agent.address.toBase58()}`);
    for (const k of candidates) {
      const r = getReceipt(k);
      if (r) {
        setReceipt(r);
        return;
      }
    }
  }, [mounted, pubkey, agent?.address]);

  if (!mounted) return null;

  if (!receipt) {
    return <PaywallGate backHref={`/explorer/agent/${encodeURIComponent(pubkey)}`} />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8 print:bg-white print:p-0 print:text-black">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between print:hidden">
          <Link
            href={`/explorer/agent/${encodeURIComponent(pubkey)}`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to agent
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
          <h1 className="mt-6 font-display text-2xl uppercase leading-tight sm:text-4xl">Agent audit trail</h1>
          <p className="mt-2 break-all font-mono text-xs text-muted-foreground print:text-gray-700">{pubkey}</p>
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

        {agent && (
          <>
            <Section title="Agent account">
              <Pair k="Status" v={agent.revoked ? 'revoked' : 'active'} />
              <Pair k="Account address (PDA)" v={agent.address.toBase58()} mono />
              <Pair k="Operator" v={agent.operator.toBase58()} mono />
              <Pair k="Agent ID (Ed25519 pubkey)" v={bytesToHex(agent.agentId)} mono />
              <Pair k="Policy root (merkle)" v={bytesToHex(agent.policyRoot)} mono />
              <Pair k="Attestations issued" v={agent.attestationCount.toLocaleString()} />
              <Pair k="Registered" v={formatTs(agent.createdAt)} />
              <Pair k="PDA bump" v={String(agent.bump)} />
              <Pair k="Network" v={NETWORK} />
              <Pair
                k="Solana Explorer"
                v={
                  <a
                    href={explorerAccountUrl(agent.address.toBase58())}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-primary underline print:text-blue-700"
                  >
                    {explorerAccountUrl(agent.address.toBase58())}
                  </a>
                }
              />
            </Section>

            <Section title={`Attestation history (${attestations.length})`}>
              {attsLoading ? (
                <p className="px-4 py-6 text-sm text-muted-foreground">Loading attestations…</p>
              ) : attestations.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted-foreground">No attestations issued yet.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead className="border-b border-border bg-muted print:bg-gray-100 print:border-black">
                    <tr>
                      <th className="px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">Slot</th>
                      <th className="px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">Tx signature</th>
                      <th className="px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">Action hash</th>
                      <th className="px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">Privacy</th>
                      <th className="px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border print:divide-black/20">
                    {attestations.map((a) => (
                      <tr key={`${a.txSignature}-${bytesToHex(a.actionHash)}`}>
                        <td className="px-3 py-2 font-mono tabular-nums">{a.slot}</td>
                        <td className="px-3 py-2 font-mono break-all">
                          {a.txSignature.slice(0, 12)}…{a.txSignature.slice(-6)}
                        </td>
                        <td className="px-3 py-2 font-pixel text-[10px] uppercase tracking-wider">
                          {ACTION_TYPE_LABEL[a.actionType]}
                        </td>
                        <td className="px-3 py-2 font-mono break-all">{bytesToHex(a.actionHash).slice(0, 16)}…</td>
                        <td className="px-3 py-2">{a.privacyMode ? 'vanish' : 'disclosed'}</td>
                        <td className="px-3 py-2 font-mono">{formatTs(a.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Section>
          </>
        )}

        <footer className="mt-16 border-t-2 border-foreground pt-6 text-xs print:border-black">
          <Pair k="Report ID" v={`agent:${pubkey}`} mono compact />
          <Pair k="Paid" v={`${receipt.amount} lamports · ${formatTs(Math.floor(receipt.paidAt / 1000))}`} compact />
          <Pair k="Receipt tx" v={receipt.txSignature} mono compact />
          <Pair k="Payer" v={receipt.payer} mono compact />
          <p className="mt-6 max-w-prose text-[11px] leading-relaxed text-muted-foreground print:text-gray-700">
            This report is a deterministic export of public on-chain data. Anyone with the agent address can reproduce
            its contents. Prova does not custody, gate, or alter the underlying data.
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
          This forensic report requires an x402 micropayment. Open the agent page and click{' '}
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
