import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service', description: 'Prova terms of service.' };

export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: May 8, 2026</p>

        <div className="mt-8 space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Acceptance</h2>
            <p className="mt-2">By using Prova, you agree to these terms. If you do not agree, do not use the service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">2. No Financial Advice</h2>
            <p className="mt-2">Prova is a software tool for cryptographic attestation. Nothing on this platform constitutes financial, legal, or investment advice.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">3. Non-Custodial</h2>
            <p className="mt-2">Prova never takes custody of user funds or private keys. You are solely responsible for the security of your keypairs.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">4. Disclaimer</h2>
            <p className="mt-2">Prova is NOT affiliated with, endorsed by, or sponsored by the Solana Foundation. Solana® is a registered trademark of the Solana Foundation.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">5. Contact</h2>
            <p className="mt-2">Legal: <a href="mailto:legal@prova.io" className="text-primary hover:underline">legal@prova.io</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
