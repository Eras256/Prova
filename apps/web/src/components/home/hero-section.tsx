import Link from 'next/link';
import { Button } from '@prova/ui';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
          Live on Solana Devnet
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Cryptographic Receipts
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            for the Agentic Internet
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Every action your AI agent takes — verifiable, signed, immutable.
          Built on Solana Attestation Service for enterprise-grade forensic trails.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90">
            <Link href="/developers/quick-start">
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/explorer">Explore Attestations</Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {['Apache 2.0 — Open Source', 'Non-custodial', 'Ed25519 signed on-chain', 'Built on SAS'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-secondary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
