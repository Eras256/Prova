const stats = [
  { value: '10K+', label: 'Attestations Issued' },
  { value: '50+', label: 'Agents Onboarded' },
  { value: '$0.0005', label: 'Per Attestation' },
  { value: '<1s', label: 'Finality' },
  { value: '100%', label: 'On-Chain Verifiable' },
];

export function StatsBar() {
  return (
    <div className="border-y border-border bg-surface/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
