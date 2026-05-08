const steps = [
  {
    n: '01',
    title: 'Your agent acts',
    desc: 'A swap, a transfer, a tool call, a model decision — anything you want on the record. Wrap it with `client.attest()` or let the SDK middleware do it for you.',
  },
  {
    n: '02',
    title: 'The SDK signs and submits',
    desc: 'The action payload is hashed, signed by the agent key, and written through the Solana Attestation Service. Confirmation in under a second, ~$0.0005 per receipt.',
  },
  {
    n: '03',
    title: 'Anyone verifies, anytime',
    desc: 'The receipt lives on-chain as a PDA. Operators, regulators, insurers, and counterparties verify it without ever talking to Prova. No API key required.',
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">How it works</p>
          </div>
          <div>
            <h2 className="font-display text-2xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">From agent action</span>
              <span className="block">to immutable proof</span>
              <span className="mt-2 block text-muted-foreground">in three steps.</span>
            </h2>
          </div>
        </div>

        <ol className="border-t border-border">
          {steps.map((s) => (
            <li
              key={s.n}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-[auto_1fr_2fr] lg:gap-12 lg:py-14"
            >
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <h3 className="font-display text-lg uppercase tracking-tight text-foreground lg:text-xl">{s.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
