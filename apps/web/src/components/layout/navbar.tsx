'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@prova/ui';
import { WalletButton } from './wallet-button';
import { LanguageSelector } from './language-selector';
import { useI18n } from '../i18n-provider';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { label: t('home'), href: '/' },
    { label: t('product'), href: '/product' },
    { label: t('explorer'), href: '/explorer' },
    { label: t('developers'), href: '/developers' },
    { label: t('solutions'), href: '/solutions/operators' },
    { label: t('pricing'), href: '/pricing' },
    { label: t('docs'), href: '/developers/docs' },
  ];

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Prova — home"
          className="group flex items-center gap-2.5"
        >
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center bg-primary font-display text-sm leading-none text-primary-foreground"
          >
            P
          </span>
          <span className="font-display text-base uppercase tracking-tight text-foreground">PROVA</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/register" className="font-mono text-xs uppercase tracking-wider">
              {t('registerAgent')}
            </Link>
          </Button>
          <LanguageSelector />
          <WalletButton size="sm" />
          <Button size="sm" asChild>
            <Link href="/developers/quick-start" className="font-mono text-xs uppercase tracking-wider">
              {t('startBuilding')}
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSelector />
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex flex-col space-y-4 px-4 pb-6 pt-4 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <WalletButton size="default" />
              <Button asChild className="w-full">
                <Link href="/developers/quick-start" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('startBuilding')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
