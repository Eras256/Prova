import type { Metadata } from 'next';
import { Button, Badge } from '@prova/ui';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, usage-based pricing for every team.',
};

const plans = [
  { name: 'Free', price: '$0', period: 'forever', desc: 'For builders and prototyping', attestations: '100 / month', support: 'Community', features: ['Basic SDK access', 'Public Forensic Explorer', 'Devnet + Mainnet', 'Apache 2.0'], cta: 'Get Started', href: '/developers/quick-start', highlight: false },
  { name: 'Builder', price: '$49', period: 'per month', desc: 'For solo developers and small agents', attestations: '10,000 / month', support: 'Email 48h', features: ['All Free features', 'Webhooks', 'API Keys', 'Basic reports', 'Priority RPC'], cta: 'Start Building', href: '/app/billing', highlight: false },
  { name: 'Growth', price: '$499', period: 'per month', desc: 'For production agents with compliance needs', attestations: '100,000 / month', support: 'Email 24h', features: ['All Builder features', 'Custom schemas', 'Advanced reports', 'Vanish privacy mode', 'Priority indexing', 'PDF forensic exports'], cta: 'Start Growing', href: '/app/billing', highlight: true, badge: 'Most Popular' },
  { name: 'Enterprise', price: '$2,499+', period: 'per month', desc: 'For compliance teams and large deployments', attestations: 'Unlimited', support: 'Dedicated CSM', features: ['All Growth features', 'SLA guarantee', 'On-prem indexer', 'Custom integrations', 'White-label', 'DPA available'], cta: 'Talk to Sales', href: '/contact', highlight: false },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">Pay for what you use. No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-xl border p-6 ${plan.highlight ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
              {'badge' in plan && plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-primary text-white">{plan.badge}</Badge>
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="ml-1 text-sm text-muted-foreground">/{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <div className="my-4 rounded-lg bg-muted/30 px-3 py-2 text-sm">
                <span className="text-white">{plan.attestations}</span>
                <span className="text-muted-foreground"> attestations</span>
              </div>
              <ul className="mb-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'} asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-center">
          <p className="text-muted-foreground">Need pay-per-query access for one-off forensic reports?</p>
          <p className="mt-1 font-medium text-white">Use the Explorer with x402 micropayments — $0.01 per query, no subscription needed.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/explorer">Try the Explorer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
