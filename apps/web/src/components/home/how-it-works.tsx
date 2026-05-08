const steps = [
  { n: '01', title: 'Agent acts', desc: 'Your AI agent executes a transaction, makes a decision, or calls a tool. The action is captured by the Prova SDK.' },
  { n: '02', title: 'SDK issues attestation', desc: 'The SDK signs the action payload with the agent key and submits it to the Solana Attestation Service via the Anchor program.' },
  { n: '03', title: 'Anyone verifies', desc: 'The attestation is permanently on-chain. Operators, regulators, or counterparties can verify it independently, anytime.' },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-muted-foreground">Three steps from agent action to immutable proof.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-4 text-4xl font-bold text-primary/30">{s.n}</div>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
