import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Prova',
  description: 'Prova terms of service.',
};

const sections = [
  {
    title: '1. Acceptance',
    body: 'By using Prova, you agree to these terms. If you do not agree, do not use the service.',
  },
  {
    title: '2. No Financial Advice',
    body: 'Prova is a software tool for cryptographic attestation. Nothing on this platform constitutes financial, legal, or investment advice.',
  },
  {
    title: '3. Non-Custodial',
    body: 'Prova never takes custody of user funds or private keys. You are solely responsible for the security of your keypairs.',
  },
  {
    title: '4. Disclaimer',
    body: 'Prova is NOT affiliated with, endorsed by, or sponsored by the Solana Foundation. Solana® is a registered trademark of the Solana Foundation.',
  },
  {
    title: '5. Contact',
    body: null,
    email: 'legal@prova.io',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Legal</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 font-mono text-xs text-muted-foreground">Last updated: May 8, 2026</p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div aria-hidden />
          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-display text-lg uppercase text-foreground">{s.title}</h2>
                {s.body && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                )}
                {s.email && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Legal inquiries:{' '}
                    <a href={`mailto:${s.email}`} className="font-mono text-primary hover:text-foreground">
                      {s.email}
                    </a>
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
