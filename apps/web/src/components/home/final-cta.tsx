import Link from 'next/link';
import { Button } from '@prova/ui';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Start in 2 minutes</h2>
        <p className="mt-4 text-lg text-muted-foreground">Install the SDK, issue your first attestation, verify it on-chain.</p>
        <div className="mt-8 rounded-xl border border-border bg-surface p-4 text-left font-mono text-sm">
          <span className="text-muted-foreground">$</span>{' '}
          <span className="text-secondary">pnpm add @prova/sdk</span>
        </div>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="gap-2">
            <Link href="/developers/quick-start">
              View Quick Start <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/developers/docs">Read the Docs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
