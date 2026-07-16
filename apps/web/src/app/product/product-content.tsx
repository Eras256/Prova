'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

export function ProductContent() {
  const { t } = useI18n();

  const sections = [
    {
      n: '01',
      tag: t('tagCore'),
      title: t('titleHowItWorks'),
      desc: t('descHowItWorks'),
      href: '/product/how',
    },
    {
      n: '02',
      tag: t('tagDevelopers'),
      title: t('titleSdk'),
      desc: t('descSdk'),
      href: '/product/sdk',
    },
    {
      n: '03',
      tag: t('tagTrust'),
      title: t('titleSecurity'),
      desc: t('descSecurity'),
      href: '/product/security',
    },
    {
      n: '04',
      tag: t('tagCompliance'),
      title: t('titlePrivacyMode'),
      desc: t('descPrivacyMode'),
      href: '/product/privacy',
    },
  ];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t('productPageTitle')}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">{t('productHeadline1')}</span>
              <span className="block">{t('productHeadline2')}</span>
              <span className="mt-2 block text-muted-foreground">{t('productHeadline3')}</span>
              <span className="block text-muted-foreground">{t('productHeadline4')}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t('productDesc')}
            </p>
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {sections.map((s) => (
            <li key={s.n} className="border-b border-border">
              <Link
                href={s.href}
                className="group grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2 py-10 transition-colors lg:grid-cols-[auto_auto_1fr_2fr_auto] lg:items-baseline lg:gap-12 lg:py-14"
              >
                <span className="font-mono text-xs text-primary col-start-1 row-start-1 lg:col-auto lg:row-auto">
                  {s.n}
                </span>
                <span className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground col-start-2 row-start-1 lg:col-auto lg:row-auto">
                  {s.tag}
                </span>
                <h2 className="font-display text-xl uppercase text-foreground transition-colors group-hover:text-primary lg:text-2xl col-start-1 col-span-2 row-start-2 lg:col-auto lg:row-auto">
                  {s.title}
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground col-start-1 col-span-3 row-start-3 lg:col-auto lg:row-auto mt-1 lg:mt-0">
                  {s.desc}
                </p>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary col-start-3 row-start-1 row-span-2 self-center justify-self-end lg:col-auto lg:row-auto" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
