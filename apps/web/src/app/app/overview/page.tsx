'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Activity, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const API_URL = process.env.NEXT_PUBLIC_PROVA_API_URL ?? 'https://prova-api.fly.dev';

const content = {
  EN: {
    pageTitle: 'Overview',
    kpis: [
      { label: 'Total Attestations', sub: 'On devnet' },
      { label: 'Active Agents',      sub: 'Registered on-chain' },
      { label: 'Attestations (7d)',  sub: 'Last 7 days' },
      { label: 'Alerts',             sub: 'All clear' },
    ],
    emptyTitle: 'No attestations yet',
    emptyDesc: 'Register an agent and issue your first attestation to see data here.',
    registerAgent: 'Register agent →',
    issueAtt: 'Issue attestation →',
    liveData: 'Live data from prova-api.fly.dev',
    indexed: 'attestations indexed.',
    openExplorer: 'Open Explorer →',
  },
  ES: {
    pageTitle: 'Resumen',
    kpis: [
      { label: 'Atestaciones totales', sub: 'En devnet' },
      { label: 'Agentes activos',      sub: 'Registrados on-chain' },
      { label: 'Atestaciones (7d)',    sub: 'Últimos 7 días' },
      { label: 'Alertas',              sub: 'Todo en orden' },
    ],
    emptyTitle: 'Sin atestaciones todavía',
    emptyDesc: 'Registra un agente y emite tu primera atestación para ver datos aquí.',
    registerAgent: 'Registrar agente →',
    issueAtt: 'Emitir atestación →',
    liveData: 'Datos en vivo desde prova-api.fly.dev',
    indexed: 'atestaciones indexadas.',
    openExplorer: 'Abrir Explorer →',
  },
  ZH: {
    pageTitle: '概览',
    kpis: [
      { label: '证明总数',    sub: '在 devnet 上' },
      { label: '活跃代理',    sub: '已链上注册' },
      { label: '证明数 (7d)', sub: '过去 7 天' },
      { label: '告警',         sub: '一切正常' },
    ],
    emptyTitle: '暂无证明',
    emptyDesc: '注册一个代理并发出您的第一个证明，即可在此查看数据。',
    registerAgent: '注册代理 →',
    issueAtt: '发出证明 →',
    liveData: '来自 prova-api.fly.dev 的实时数据',
    indexed: '条证明已索引。',
    openExplorer: '打开 Explorer →',
  },
};

interface Stats {
  totalAttestations: number;
  activeAgents: number;
  week: number;
}

async function fetchStats(): Promise<Stats> {
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const [statsRes, weekRes] = await Promise.all([
    fetch(`${API_URL}/api/v1/stats`),
    fetch(`${API_URL}/api/v1/attestations?limit=1&from=${weekAgo}`),
  ]);
  const statsData = statsRes.ok
    ? ((await statsRes.json()) as { attestations: number; agents: number })
    : { attestations: 0, agents: 0 };
  const weekData = weekRes.ok
    ? ((await weekRes.json()) as { pagination: { total: number } })
    : { pagination: { total: 0 } };
  return {
    totalAttestations: statsData.attestations,
    activeAgents: statsData.agents,
    week: weekData.pagination?.total ?? 0,
  };
}

const ICONS = [Shield, Activity, TrendingUp, AlertTriangle];

export default function DashboardOverviewPage() {
  const { lang } = useI18n();
  const t = content[lang];

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => setStats({ totalAttestations: 0, activeAgents: 0, week: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const values = loading
    ? ['…', '…', '…', '0']
    : [
        (stats?.totalAttestations ?? 0).toLocaleString(),
        (stats?.activeAgents ?? 0).toLocaleString(),
        (stats?.week ?? 0).toLocaleString(),
        '0',
      ];

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-2xl uppercase text-foreground">{t.pageTitle}</h1>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {/* KPI grid */}
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {t.kpis.map((kpi, i) => {
            const Icon = ICONS[i]!;
            return (
              <div key={kpi.label} className="flex flex-col gap-1.5 bg-background px-5 py-6 sm:px-6 sm:py-7">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </span>
                  <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <span className="font-display text-2xl uppercase tabular-nums text-foreground">
                  {values[i]}
                </span>
                <span className="text-xs text-muted-foreground">{kpi.sub}</span>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {!loading && stats?.totalAttestations === 0 && (
          <div className="mt-8 border border-border bg-background p-6 text-center sm:p-8">
            <Shield className="mx-auto mb-4 h-12 w-12 text-primary/40" strokeWidth={1.5} />
            <h3 className="font-display text-lg uppercase text-foreground">{t.emptyTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.emptyDesc}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/app/register"
                className="border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground hover:border-primary hover:text-primary"
              >
                {t.registerAgent}
              </Link>
              <Link
                href="/app/issue"
                className="border border-primary bg-primary px-4 py-2 font-mono text-xs uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                {t.issueAtt}
              </Link>
            </div>
          </div>
        )}

        {/* Live data banner */}
        {!loading && stats && stats.totalAttestations > 0 && (
          <div className="mt-8 border border-border bg-background p-5 sm:p-6">
            <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.liveData}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {stats.totalAttestations.toLocaleString()} {t.indexed}{' '}
              <Link href="/explorer" className="text-primary hover:underline">
                {t.openExplorer}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
