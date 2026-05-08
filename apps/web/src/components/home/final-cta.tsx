import Link from 'next/link';
import { Button } from '@prova/ui';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
        <div>
          <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Begin</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
            <span className="block">Your first attestation,</span>
            <span className="block">in the next</span>
            <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">two minutes.</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Install the SDK. Wrap one agent action. Watch the receipt land on Solana.
            Free for the first 100 — no card, no sales call, no waitlist.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">terminal</span>
              <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">~/your-agent</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-4 font-mono text-sm">
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground">pnpm add</span>
              <span className="text-primary">@prova/sdk</span>
              <span className="ml-1 inline-block h-4 w-[7px] animate-blink bg-primary align-middle" aria-hidden />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-12 flex-1 gap-2 px-6 text-sm font-semibold uppercase tracking-wider">
              <Link href="/developers/quick-start">
                Open the Quick Start
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 flex-1 px-6 text-sm font-semibold uppercase tracking-wider">
              <Link href="/developers/docs">Read the docs</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Questions before you start?{' '}
            <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">
              Talk to an engineer →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
