import { Shield, Lock, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Signed by the agent that did the work',
    description: 'Every attestation carries an Ed25519 signature from the agent key. No shared secrets. No impersonation.',
  },
  {
    icon: Lock,
    title: 'Immutable the moment it lands',
    description: 'Once on Solana, the receipt cannot be altered, deleted, or backdated. Not by you. Not by us.',
  },
  {
    icon: CheckCircle2,
    title: 'Verifiable without trusting Prova',
    description: 'Counterparties, regulators, and your own legal team verify any attestation directly on-chain.',
  },
];

const CODE = `import { ProvaClient, AttestationBuilder } from '@prova/sdk';

const client = new ProvaClient({ rpcUrl, agentKeypair });

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Attested:', receipt.id);
// → att_4Kf9...x2pQ — on-chain PDA, globally verifiable`;

export function SolutionSection() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">The fix</p>
            <h2 className="mt-3 font-display text-2xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">One signed receipt</span>
              <span className="block">for every</span>
              <span className="block bg-primary px-2 text-primary-foreground">action.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Prova issues behavior attestations through the Solana Attestation Service — the same Foundation-backed primitive
              used for on-chain identity. You get a forensic trail that survives audits, lawsuits, and the next AI policy update.
            </p>

            <div className="mt-10 space-y-7 border-t border-border pt-8">
              {features.map((f) => (
                <div key={f.title} className="grid grid-cols-[auto_1fr] gap-5">
                  <f.icon className="mt-1 h-4 w-4 text-primary" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-foreground">{f.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">attest.ts</span>
                <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">9 lines</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-foreground/90">
                <code>{CODE}</code>
              </pre>
            </div>
            <p className="mt-4 font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
              No queue · No batching · No servers to run
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
