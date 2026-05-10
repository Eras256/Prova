'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '../i18n-provider';

const API_URL = process.env.NEXT_PUBLIC_PROVA_API_URL ?? 'https://prova-api.fly.dev';

interface Counts {
  attestations: number;
  agents: number;
}

const labels = {
  EN: {
    finalityV: '< 1s',
    finalityL: 'MPP Finality',
    finalityS: 'On-chain settlement',
    feeV: '$0.0005',
    feeL: 'Per receipt',
    feeS: 'Zero-trust scalability',
    attestL: 'Attestations',
    attestS: 'Indexed on devnet',
    agentL: 'Live agents',
    agentS: 'Secured autonomous agents',
    sourceV: 'Apache 2.0',
    sourceL: 'Source',
    sourceS: 'Enterprise open-source',
  },
  ES: {
    finalityV: '< 1s',
    finalityL: 'Finalidad MPP',
    finalityS: 'Liquidación on-chain',
    feeV: '$0.0005',
    feeL: 'Por recibo',
    feeS: 'Escalabilidad zero-trust',
    attestL: 'Atestaciones',
    attestS: 'Indexadas en devnet',
    agentL: 'Agentes activos',
    agentS: 'Agentes autónomos asegurados',
    sourceV: 'Apache 2.0',
    sourceL: 'Fuente',
    sourceS: 'Open-source empresarial',
  },
  ZH: {
    finalityV: '< 1s',
    finalityL: '最终确认',
    finalityS: '链上确认',
    feeV: '$0.0005',
    feeL: '单据成本',
    feeS: '比 EVM 便宜 500 倍',
    attestL: '证明总数',
    attestS: 'devnet 上已索引',
    agentL: '活跃代理',
    agentS: 'devnet 上已注册',
    sourceV: 'Apache 2.0',
    sourceL: '源码',
    sourceS: '自行审计',
  },
};

async function fetchCounts(): Promise<Counts> {
  const res = await fetch(`${API_URL}/api/v1/stats`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function StatsBar() {
  const { lang } = useI18n();
  const t = labels[lang];
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const c = await fetchCounts();
        if (!cancelled) setCounts(c);
      } catch {
        // En caso de error, mostramos guiones en lugar de mentir.
      }
    }
    load();
    const refresh = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, []);

  const stats = [
    { value: t.finalityV, label: t.finalityL, sub: t.finalityS },
    { value: t.feeV, label: t.feeL, sub: t.feeS },
    { value: counts ? counts.attestations.toLocaleString() : '—', label: t.attestL, sub: t.attestS },
    { value: counts ? counts.agents.toLocaleString() : '—', label: t.agentL, sub: t.agentS },
    { value: t.sourceV, label: t.sourceL, sub: t.sourceS },
  ];

  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 divide-y divide-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x lg:grid-cols-5">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1.5 px-4 py-7 sm:px-6 ${
                i % 2 === 1 ? 'border-l border-border sm:border-l-0' : ''
              }`}
            >
              <dt className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </dt>
              <dd className="font-display text-xl text-foreground sm:text-2xl tabular-nums">
                {s.value}
              </dd>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
