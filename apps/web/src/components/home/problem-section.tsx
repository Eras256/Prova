import { AlertTriangle, FileX, EyeOff } from 'lucide-react';

const problems = [
  { icon: AlertTriangle, title: 'No forensic trail', description: "When an AI agent makes a costly mistake, there's no tamper-proof record of what it did, when, or why." },
  { icon: FileX, title: 'Off-chain logs are fragile', description: 'Server logs can be deleted, edited, or lost. They are not cryptographically signed and cannot be independently verified.' },
  { icon: EyeOff, title: 'Regulators are watching', description: 'EU AI Act, MetaComp KYA, and emerging frameworks require operators to demonstrate agent accountability.' },
];

export function ProblemSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            24,000+ AI agents are on Solana.
            <br />
            <span className="text-muted-foreground">None have a forensic trail.</span>
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-surface p-6">
              <p.icon className="mb-4 h-8 w-8 text-destructive" />
              <h3 className="mb-2 text-lg font-semibold text-white">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
