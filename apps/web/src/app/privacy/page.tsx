import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Prova handles your data.' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="prose prose-invert mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: May 8, 2026</p>

        <div className="mt-8 space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Data We Collect</h2>
            <p className="mt-2">Prova collects the minimum data necessary to provide our service: Solana wallet addresses (public keys only), on-chain attestation data (public by design), and usage metrics for billing.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">2. On-Chain Data</h2>
            <p className="mt-2">Data submitted to the Solana blockchain is public and immutable. Do not submit personally identifiable information in attestation payloads. Use Privacy Mode (Vanish Core) for sensitive data.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">3. LFPDPPP Compliance (Mexico)</h2>
            <p className="mt-2">Prova complies with the Ley Federal de Protección de Datos Personales en Posesión de los Particulares. For ARCO requests (Access, Rectification, Cancellation, Opposition), contact: privacy@prova.io.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">4. Contact</h2>
            <p className="mt-2">Privacy inquiries: <a href="mailto:privacy@prova.io" className="text-primary hover:underline">privacy@prova.io</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
