'use client';

import { useI18n } from '../i18n-provider';

const content = {
  EN: [
    { value: '< 1s', label: 'Finality', sub: 'On-chain confirmation' },
    { value: '$0.0005', label: 'Per receipt', sub: '500× cheaper than EVM' },
    { value: '10,247', label: 'Attestations', sub: 'Across pilot agents' },
    { value: '52', label: 'Live agents', sub: 'On Devnet' },
    { value: 'Apache 2.0', label: 'Source', sub: 'Audit it yourself' },
  ],
  ES: [
    { value: '< 1s', label: 'Finalidad', sub: 'Confirmación on-chain' },
    { value: '$0.0005', label: 'Por recibo', sub: '500× más barato que EVM' },
    { value: '10,247', label: 'Atestaciones', sub: 'En agentes piloto' },
    { value: '52', label: 'Agentes en vivo', sub: 'En Devnet' },
    { value: 'Apache 2.0', label: 'Fuente', sub: 'Audítalo tú mismo' },
  ],
  ZH: [
    { value: '< 1s', label: '最终确认', sub: '链上确认' },
    { value: '$0.0005', label: '单据成本', sub: '比 EVM 便宜 500 倍' },
    { value: '10,247', label: '证明总数', sub: '跨越多个试点代理' },
    { value: '52', label: '活跃代理', sub: '在 Devnet 上' },
    { value: 'Apache 2.0', label: '源码', sub: '自行审计' },
  ]
};

export function StatsBar() {
  const { lang } = useI18n();
  const stats = content[lang];
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
              <dd className="font-display text-xl text-foreground sm:text-2xl">
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
