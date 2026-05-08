import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'For AI Agent Operators', description: 'Why every agent needs behavior attestations.' };

const benefits = [
  'Prove your agent acted within its authorized scope',
  'Generate compliance reports for regulators on demand',
  'Detect anomalous agent behavior before it causes damage',
  'Reduce liability exposure with cryptographic evidence',
  'Build trust with enterprise customers through transparency',
  'Meet MetaComp KYA and EU AI Act requirements',
];

export default function OperatorsPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">Solutions</p>
        <h1 className="text-4xl font-bold text-white">For AI Agent Operators</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every agent you deploy is a liability if its actions can&apos;t be audited. Prova gives you the forensic trail you need.
        </p>

        <div className="mt-12 space-y-3">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <p className="text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex gap-4">
          <Button asChild><Link href="/developers/quick-start">Get Started</Link></Button>
          <Button variant="outline" asChild><Link href="/pricing">View Pricing</Link></Button>
        </div>
      </div>
    </div>
  );
}
