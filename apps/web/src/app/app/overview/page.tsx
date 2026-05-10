'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Activity, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_PROVA_API_URL ?? 'https://prova-api.fly.dev';

interface Stats {
  totalAttestations: number;
  activeAgents: number;
  week: number;
}

async function fetchStats(): Promise<Stats> {
  const [attsRes, agentsRes] = await Promise.all([
    fetch(`${API_URL}/api/v1/attestations?limit=1`),
    fetch(`${API_URL}/api/v1/attestations?limit=1&offset=0`),
  ]);

  const attsData = attsRes.ok ? await attsRes.json() : { pagination: { total: 0 } };

  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const weekRes = await fetch(`${API_URL}/api/v1/attestations?limit=1&from=${weekAgo}`);
  const weekData = weekRes.ok ? await weekRes.json() : { pagination: { total: 0 } };

  return {
    totalAttestations: attsData.pagination?.total ?? 0,
    activeAgents: 0,
    week: weekData.pagination?.total ?? 0,
  };
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => setStats({ totalAttestations: 0, activeAgents: 0, week: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    {
      label: 'Total Attestations',
      value: loading ? '…' : (stats?.totalAttestations ?? 0).toLocaleString(),
      icon: Shield,
      sub: 'On devnet',
    },
    {
      label: 'Active Agents',
      value: loading ? '…' : (stats?.activeAgents ?? 0).toLocaleString(),
      icon: Activity,
      sub: 'Registered on-chain',
    },
    {
      label: 'Attestations (7d)',
      value: loading ? '…' : (stats?.week ?? 0).toLocaleString(),
      icon: TrendingUp,
      sub: 'Last 7 days',
    },
    {
      label: 'Alerts',
      value: '0',
      icon: AlertTriangle,
      sub: 'All clear',
    },
  ];

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-2xl uppercase text-foreground">Overview</h1>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="flex flex-col gap-1.5 bg-background px-6 py-7">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">
                  {kpi.label}
                </span>
                <kpi.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <span className="font-display text-2xl uppercase tabular-nums text-foreground">
                {kpi.value}
              </span>
              <span className="text-xs text-muted-foreground">{kpi.sub}</span>
            </div>
          ))}
        </div>

        {!loading && stats?.totalAttestations === 0 && (
          <div className="mt-8 border border-border bg-background p-8 text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-primary/40" strokeWidth={1.5} />
            <h3 className="font-display text-lg uppercase text-foreground">No attestations yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Register an agent and issue your first attestation to see data here.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/app/register"
                className="border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground hover:border-primary hover:text-primary"
              >
                Register agent →
              </Link>
              <Link
                href="/app/issue"
                className="border border-primary bg-primary px-4 py-2 font-mono text-xs uppercase tracking-wider text-primary-foreground"
              >
                Issue attestation →
              </Link>
            </div>
          </div>
        )}

        {!loading && stats && stats.totalAttestations > 0 && (
          <div className="mt-8 border border-border bg-background p-6">
            <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">
              Live data from prova-api.fly.dev
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {stats.totalAttestations.toLocaleString()} attestations indexed.{' '}
              <Link href="/explorer" className="text-primary hover:underline">
                Open Explorer →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
