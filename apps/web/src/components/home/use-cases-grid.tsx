import { Scale, ShieldCheck, FileSearch, BarChart3 } from 'lucide-react';

const cases = [
  { icon: Scale, title: 'Compliance', desc: 'Meet MetaComp KYA and EU AI Act requirements with immutable agent behavior records.' },
  { icon: ShieldCheck, title: 'Insurance', desc: 'Provide forensic evidence for agent-related claims with cryptographic proof.' },
  { icon: FileSearch, title: 'Legal & Dispute', desc: 'On-chain attestations as court-admissible evidence in agent liability cases.' },
  { icon: BarChart3, title: 'Audit & Risk', desc: 'Real-time auditing dashboards for continuous compliance monitoring.' },
];

export function UseCasesGrid() {
  return (
    <section className="bg-surface/30 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white">Built for every stakeholder</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c) => (
            <div key={c.title} className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <c.icon className="mb-4 h-8 w-8 text-primary transition-colors group-hover:text-secondary" />
              <h3 className="mb-2 font-semibold text-white">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
