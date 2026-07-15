'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@prova/ui';
import { ArrowRight } from 'lucide-react';
import { LiveAttestationFeed } from './live-attestation-feed';
import { useI18n } from '../i18n-provider';

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20">
        <div>
          <div className="animate-fade-up">
            <Link
              href="https://www.npmjs.com/package/prova-agent-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-border bg-surface/60 px-2.5 py-1 text-xs transition-colors hover:border-primary/40"
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-pixel text-[13px] uppercase tracking-wider text-foreground">{t('live')}</span>
              <span className="text-border">·</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
                {t('shippedThisWeek')}
              </span>
            </Link>
          </div>

          <h1 className="mt-8 animate-fade-up font-display text-[2.75rem] uppercase leading-[0.92] text-foreground [animation-delay:80ms] sm:text-[3.75rem] lg:text-[5rem]">
            <span className="block">{t('heroTitle1')}</span>
            <span className="block">{t('heroTitle2')}</span>
            <span className="block">{t('heroTitle3')}</span>
            <span className="block bg-primary px-2 text-primary-foreground">{t('heroTitle4')}</span>
            <span className="block">{t('heroTitle5')}</span>
          </h1>

          <p className="mt-8 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:180ms] sm:text-lg">
            {t('heroDesc1')}
            <span className="text-foreground">{t('heroDesc2')}</span>
          </p>

          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:280ms] sm:flex-row sm:items-center">
            <Button asChild size="lg" className="group h-12 gap-2 px-6 text-sm font-mono uppercase tracking-wider">
              <Link href="/developers/quick-start">
                {t('shipFirst')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-sm font-mono uppercase tracking-wider">
              <Link href="/explorer">{t('seeFeed')}</Link>
            </Button>
          </div>

          <div className="mt-10 grid animate-fade-up grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 [animation-delay:380ms] sm:grid-cols-4 sm:gap-x-6">
            {[
              { k: '< 1s', v: t('finality') },
              { k: '$0.0005', v: t('perReceipt') },
              { k: 'Apache 2.0', v: t('openSource') },
              { k: 'Ed25519', v: t('native') },
            ].map((m) => (
              <div key={m.v}>
                <div className="font-display text-xl text-foreground sm:text-2xl">{m.k}</div>
                <div className="mt-1 font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center animate-fade-up [animation-delay:420ms] lg:pl-4">
          <div className="mb-12 flex w-full justify-center opacity-80 transition-opacity hover:opacity-100">
            <Image 
              src="/ProvaLogo.png" 
              alt="Prova Logo" 
              width={400} 
              height={100} 
              className="w-72 sm:w-96 object-contain"
              priority
            />
          </div>
          <div className="w-full">
            <LiveAttestationFeed />
            <p className="mt-4 text-center font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
              {t('feedFooter')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
