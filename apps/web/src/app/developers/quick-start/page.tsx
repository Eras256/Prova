import type { Metadata } from 'next';
import { Badge } from '@prova/ui';

export const metadata: Metadata = {
  title: 'Quick Start',
  description: 'Issue your first behavior attestation in minutes.',
};

const steps = [
  { step: 1, title: 'Install the SDK', code: `pnpm add @prova/sdk` },
  { step: 2, title: 'Initialize the client', code: `import { ProvaClient } from '@prova/sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: 'https://api.devnet.solana.com',
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});` },
  { step: 3, title: 'Issue your first attestation', code: `import { AttestationBuilder } from '@prova/sdk';

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Attested:', receipt.id);` },
  { step: 4, title: 'Verify from anywhere', code: `const result = await client.verify(receipt.id);
console.log('Valid:', result.valid); // true` },
];

export default function QuickStartPage() {
  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Badge variant="secondary" className="mb-4">Developers</Badge>
        <h1 className="text-4xl font-bold text-white">Quick Start</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Issue your first AI agent behavior attestation on Solana in under 2 minutes.
        </p>
        <div className="mt-12 space-y-8">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {s.step}
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-lg font-semibold text-white">{s.title}</h3>
                <div className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm text-green-400">
                  <pre>{s.code}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-xl border border-border bg-primary/5 p-6">
          <h3 className="font-semibold text-white">What happens on-chain?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Each <code className="text-primary">attest()</code> call creates a <code className="text-primary">BehaviorAttestation</code> account on Solana via the Anchor program. The account stores the action hash, type, Ed25519 signature, and timestamp — SAS-compatible.
          </p>
        </div>
      </div>
    </div>
  );
}
