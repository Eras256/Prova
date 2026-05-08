import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@prova/ui';
import { Shield, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard Overview' };

const kpis = [
  { label: 'Total Attestations', value: '0', icon: Shield, sub: '+0 today' },
  { label: 'Active Agents', value: '0', icon: Activity, sub: '0 registered' },
  { label: 'Attestations (7d)', value: '0', icon: TrendingUp, sub: 'No data yet' },
  { label: 'Alerts', value: '0', icon: AlertTriangle, sub: 'All clear' },
];

export default function DashboardOverviewPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-2xl font-bold text-white">Overview</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpi.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-primary/40" />
          <h3 className="text-lg font-semibold text-white">No attestations yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Install the SDK and issue your first attestation to see data here.</p>
        </div>
      </div>
    </div>
  );
}
