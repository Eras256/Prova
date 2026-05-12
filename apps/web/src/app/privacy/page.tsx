import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Prova',
  description: 'How Prova handles your data.',
};

const sections = [
  {
    title: '1. Data We Collect',
    body: 'Prova collects the minimum data necessary to provide our service: Solana wallet addresses (public keys only), on-chain attestation data (public by design), and usage metrics for billing.',
  },
  {
    title: '2. On-Chain Data',
    body: 'Data submitted to the Solana blockchain is public and immutable. Do not submit personally identifiable information in attestation payloads. Use Privacy Mode (Vanish Core) for sensitive data.',
  },
  {
    title: '3. LFPDPPP Compliance (Mexico)',
    body: 'Prova complies with the Ley Federal de Protección de Datos Personales en Posesión de los Particulares. For ARCO requests (Access, Rectification, Cancellation, Opposition), contact: privacy@prova.io.',
  },
  {
    title: '4. Contact',
    body: null,
    email: 'privacy@prova.io',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Legal</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              Privacy Policy
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
                    Privacy inquiries:{' '}
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
