import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Prova',
  description: 'The story behind Prova and our mission.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white">About Prova</h1>
        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Prova was founded in 2026 with a single conviction: the agentic economy cannot function without forensic accountability. As AI agents began handling real financial decisions on Solana, we saw a critical gap — thousands of agents acting, but no tamper-proof record of what they did.
          </p>
          <p>
            We built Prova as the missing layer. Not another identity protocol, not another reputation registry — but a behavior attestation layer that captures <em className="text-white">what agents actually do</em>, signed by their keys, anchored on-chain, independently verifiable.
          </p>
          <p>
            Prova is open source (Apache 2.0), non-custodial, and built on Solana Attestation Service — the Foundation-backed standard. We exist to make the agentic internet trustworthy.
          </p>
          <blockquote className="border-l-4 border-primary pl-4 italic text-white">
            "Every agent action deserves a cryptographic receipt."
          </blockquote>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-xs text-muted-foreground">
          <strong className="text-white">Legal disclaimer:</strong> Prova is an independent software project and is NOT affiliated with, endorsed by, or sponsored by the Solana Foundation. Solana® is a registered trademark of the Solana Foundation. Prova does not custody user funds or provide financial advice.
        </div>
      </div>
    </div>
  );
}
