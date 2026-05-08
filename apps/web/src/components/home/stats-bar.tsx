const stats = [
  { value: '< 1s', label: 'Finality', sub: 'On-chain confirmation' },
  { value: '$0.0005', label: 'Per receipt', sub: '500× cheaper than EVM' },
  { value: '10,247', label: 'Attestations', sub: 'Across pilot agents' },
  { value: '52', label: 'Live agents', sub: 'On Devnet' },
  { value: 'Apache 2.0', label: 'Source', sub: 'Audit it yourself' },
];

export function StatsBar() {
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
