import Link from 'next/link';
import { Button } from '@prova/ui';
import { ArrowRight } from 'lucide-react';
import { LiveAttestationFeed } from './live-attestation-feed';

export function HeroSection() {
  return (
    <section className="relative px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20">
        <div>
          <div className="animate-fade-up">
            <Link
              href="/changelog"
              className="group inline-flex items-center gap-2 border border-border bg-surface/60 px-2.5 py-1 text-xs transition-colors hover:border-primary/40"
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-pixel text-[13px] uppercase tracking-wider text-foreground">LIVE</span>
              <span className="text-border">·</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
                v0.4 shipped this week →
              </span>
            </Link>
          </div>

          <h1 className="mt-8 animate-fade-up font-display text-[2.75rem] uppercase leading-[0.92] text-foreground [animation-delay:80ms] sm:text-[3.75rem] lg:text-[5rem]">
            <span className="block">A verifiable</span>
            <span className="block">record of every</span>
            <span className="block">action your</span>
            <span className="block bg-primary px-2 text-primary-foreground">AI agent</span>
            <span className="block">takes.</span>
          </h1>

          <p className="mt-8 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:180ms] sm:text-lg">
            Prova writes a signed, on-chain receipt for every transaction, decision, and tool call your agent makes —
            <span className="text-foreground"> sub-second, sub-cent, verifiable by anyone, forever.</span>
          </p>

          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:280ms] sm:flex-row sm:items-center">
            <Button asChild size="lg" className="group h-12 gap-2 px-6 text-sm font-semibold uppercase tracking-wider">
              <Link href="/developers/quick-start">
                Ship your first attestation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-sm font-semibold uppercase tracking-wider">
              <Link href="/explorer">See the live feed</Link>
            </Button>
          </div>

          <div className="mt-10 grid animate-fade-up grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 [animation-delay:380ms] sm:grid-cols-4 sm:gap-x-6">
            {[
              { k: '< 1s', v: 'finality' },
              { k: '$0.0005', v: 'per receipt' },
              { k: 'Apache 2.0', v: 'open source' },
              { k: 'SAS', v: 'native' },
            ].map((m) => (
              <div key={m.v}>
                <div className="font-display text-xl text-foreground sm:text-2xl">{m.k}</div>
                <div className="mt-1 font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:420ms] lg:pl-4">
          <LiveAttestationFeed />
          <p className="mt-4 text-center font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
            Real schema · Mock data on devnet · Verify any of it →
          </p>
        </div>
      </div>
    </section>
  );
}
