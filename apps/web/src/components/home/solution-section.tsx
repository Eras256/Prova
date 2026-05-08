import { Shield, Lock, CheckCircle } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Cryptographic signature', description: 'Every attestation is Ed25519-signed by the agent key and stored on-chain.' },
  { icon: Lock, title: 'Immutable record', description: 'Attestations on Solana cannot be altered or deleted after issuance.' },
  { icon: CheckCircle, title: 'Independent verification', description: 'Any third party can verify any attestation without trusting Prova.' },
];

const CODE = `import { ProvaClient, AttestationBuilder } from '@prova/sdk';

const client = new ProvaClient({ rpcUrl, agentKeypair });

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

// receipt.id — on-chain PDA, globally verifiable
console.log('Attested:', receipt.id);`;

export function SolutionSection() {
  return (
    <section className="bg-surface/30 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">The Solution</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              A cryptographic receipt for every agent action.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Prova issues behavior attestations via the Solana Attestation Service — a Foundation-backed infrastructure for on-chain verified claims.
            </p>
            <div className="mt-8 space-y-4">
              {features.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <div>
                    <p className="font-medium text-white">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 font-mono text-sm">
            <div className="mb-3 text-muted-foreground">{'// Issue attestation in 3 lines'}</div>
            <pre className="overflow-x-auto text-green-400">{CODE}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
