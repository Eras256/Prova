const problems = [
  {
    n: '01',
    title: 'No forensic trail',
    description:
      'When an agent drains a wallet, mis-prices a swap, or hallucinates a tool call, you have no signed record of what it did. Just a JSON line in a log file someone could rewrite.',
  },
  {
    n: '02',
    title: 'Off-chain logs are evidence in name only',
    description:
      'Database rows can be edited. Cloud logs expire. Nothing is cryptographically signed by the agent that did the work — so nothing holds up to a regulator, an insurer, or a judge.',
  },
  {
    n: '03',
    title: 'Regulators are already writing the rules',
    description:
      'EU AI Act, MetaComp KYA, and the next round of US state-level frameworks all require operator-side accountability. "We have logs" stops being an answer in 2026.',
  },
];

export function ProblemSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-pixel text-[13px] uppercase tracking-wider text-muted-foreground">
              The problem
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              May 2026 · Solana mainnet
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl uppercase leading-[1.0] text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">24,000 AI agents are</span>
              <span className="block">live on Solana.</span>
              <span className="mt-2 block text-muted-foreground">Not one can prove</span>
              <span className="block text-muted-foreground">what it did yesterday.</span>
            </h2>
          </div>
        </div>

        <div className="border-t border-border">
          {problems.map((p) => (
            <div
              key={p.n}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-[auto_1fr_2fr] lg:gap-12 lg:py-14"
            >
              <span className="font-mono text-xs text-primary">{p.n}</span>
              <h3 className="font-display text-lg uppercase tracking-tight text-foreground lg:text-xl">{p.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
