import type { Metadata } from 'next';
import { Button, Badge } from '@prova/ui';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — pay only for the receipts you sign',
  description:
    'Free for the first 100 attestations. From $0.0005 per receipt after that. No hidden fees, no minimums, no sales call to start.',
  alternates: { canonical: '/pricing' },
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'For prototypes and weekend builds',
    attestations: '100 / month',
    support: 'Community Discord',
    features: ['Full SDK access', 'Public Forensic Explorer', 'Devnet + Mainnet', 'Apache 2.0 source'],
    cta: 'Start free',
    href: '/developers/quick-start',
    highlight: false,
  },
  {
    name: 'Builder',
    price: '$49',
    period: 'per month',
    desc: 'For solo devs shipping their first agent',
    attestations: '10,000 / month',
    support: 'Email · 48h response',
    features: ['Everything in Free', 'Webhooks + API keys', 'Basic CSV reports', 'Priority Solana RPC'],
    cta: 'Start Builder',
    href: '/app/billing?plan=builder',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$499',
    period: 'per month',
    desc: 'For teams running agents in production',
    attestations: '100,000 / month',
    support: 'Email · 24h response',
    features: [
      'Everything in Builder',
      'Custom attestation schemas',
      'PDF forensic exports',
      'Vanish privacy mode',
      'Priority indexing SLA',
    ],
    cta: 'Start Growth',
    href: '/app/billing?plan=growth',
    highlight: true,
    badge: 'Most teams pick this',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored',
    desc: 'For compliance leads and regulated workloads',
    attestations: 'Unlimited',
    support: 'Dedicated CSM + Slack',
    features: [
      'Everything in Growth',
      'Signed SLA + uptime credits',
      'Self-hosted indexer option',
      'SSO / SAML',
      'DPA, MSA, custom terms',
    ],
    cta: 'Talk to sales',
    href: '/contact?topic=enterprise',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Pricing</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">Pay only for</span>
              <span className="block">the receipts</span>
              <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">you sign.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              From less than a tenth of a cent per attestation. Free for the first 100 every month, forever — no card, no expiring trial.
            </p>
          </div>
        </div>

        <div className="mt-16 grid border-t border-border md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative flex flex-col gap-5 border-b border-border p-7 ${
                i > 0 ? 'lg:border-l lg:border-border' : ''
              } ${plan.highlight ? 'bg-primary/[0.03]' : ''} md:[&:nth-child(2)]:border-l md:[&:nth-child(2)]:border-border lg:[&:nth-child(2)]:border-l lg:[&:nth-child(4)]:border-l`}
            >
              {'badge' in plan && plan.badge && (
                <div className="absolute -top-2.5 left-7">
                  <Badge className="border-0 bg-primary font-pixel text-[12px] uppercase tracking-wider text-primary-foreground">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div>
                <h3 className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl uppercase text-foreground lg:text-4xl">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              </div>

              <div className="border-y border-border py-4">
                <p className="text-sm">
                  <span className="text-foreground">{plan.attestations}</span>{' '}
                  <span className="text-muted-foreground">attestations</span>
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {plan.support}
                </p>
              </div>

              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-auto w-full"
                variant={plan.highlight ? 'default' : 'outline'}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-px bg-border md:grid-cols-2">
          <div className="bg-background p-8">
            <h2 className="font-display text-xl uppercase text-foreground">Just need a single forensic report?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Skip the subscription. Pay $0.01 per Explorer query with x402 micropayments — no account, no commitment.
            </p>
            <Button variant="outline" className="mt-5" asChild>
              <Link href="/explorer">Try the Explorer</Link>
            </Button>
          </div>
          <div className="bg-background p-8">
            <h2 className="font-display text-xl uppercase text-foreground">Switching from off-chain logging?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We&apos;ll waive your first month and migrate the last 90 days of your existing logs into signed attestations.
            </p>
            <Button variant="outline" className="mt-5" asChild>
              <Link href="/contact?topic=migration">Book a 20-min call</Link>
            </Button>
          </div>
        </div>

        <p className="mt-16 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          All plans include the Apache 2.0 SDK. No vendor lock-in. Export your attestations to anywhere — they live on Solana, not on our servers.
        </p>
      </div>
    </div>
  );
}
