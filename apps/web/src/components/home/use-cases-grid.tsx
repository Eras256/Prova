import { Scale, ShieldCheck, FileSearch, BarChart3 } from 'lucide-react';

const cases = [
  {
    icon: Scale,
    persona: 'Compliance',
    title: 'Pass the AI Act audit on the first try',
    desc: 'Map every agent action to MetaComp KYA and EU AI Act articles. Export PDF reports your auditor will actually accept.',
  },
  {
    icon: ShieldCheck,
    persona: 'Underwriters',
    title: 'Price agent risk with real evidence',
    desc: 'Settle agent-related claims in days, not quarters. Cryptographic proof replaces "the customer says…" forever.',
  },
  {
    icon: FileSearch,
    persona: 'Legal',
    title: 'Court-admissible by construction',
    desc: 'On-chain attestations meet the Federal Rules of Evidence 901 standard for authenticity — no expert witness required.',
  },
  {
    icon: BarChart3,
    persona: 'Risk & ops',
    title: 'Catch drift before it costs you',
    desc: 'Stream attestations into Datadog, Splunk, or your own SIEM. Real-time dashboards on what every agent is actually doing.',
  },
];

export function UseCasesGrid() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">For the people who carry the risk</p>
          </div>
          <div>
            <h2 className="font-display text-2xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">One receipt.</span>
              <span className="mt-2 block text-muted-foreground">Four people who finally</span>
              <span className="block text-muted-foreground">sleep at night.</span>
            </h2>
          </div>
        </div>

        <div className="grid border-t border-border md:grid-cols-2 md:divide-x md:divide-border lg:grid-cols-4">
          {cases.map((c, i) => (
            <article
              key={c.persona}
              className={`flex flex-col gap-5 border-b border-border p-8 ${
                i % 2 === 1 ? 'border-l border-border md:border-l-0' : ''
              } lg:border-b-0`}
            >
              <c.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <p className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
                {c.persona}
              </p>
              <h3 className="font-display text-base uppercase leading-tight text-foreground sm:text-lg">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
