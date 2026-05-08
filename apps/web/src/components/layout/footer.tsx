import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Separator } from '@prova/ui';

const sections = {
  Product: [
    { label: 'How It Works', href: '/product/how' },
    { label: 'SDK', href: '/product/sdk' },
    { label: 'Security', href: '/product/security' },
    { label: 'Privacy', href: '/product/privacy' },
  ],
  Developers: [
    { label: 'Quick Start', href: '/developers/quick-start' },
    { label: 'Documentation', href: '/developers/docs' },
    { label: 'API Reference', href: '/developers/api' },
    { label: 'Examples', href: '/developers/examples' },
  ],
  Solutions: [
    { label: 'For Compliance', href: '/solutions/compliance' },
    { label: 'For Operators', href: '/solutions/operators' },
    { label: 'For Legal', href: '/solutions/legal' },
    { label: 'For Auditors', href: '/solutions/auditors' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-white">Prova</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">Cryptographic receipts for the agentic internet.</p>
            <div className="mt-4 flex gap-3">
              <a href="https://github.com/prova-io/prova" className="text-sm text-muted-foreground hover:text-white">GitHub</a>
              <a href="https://x.com/prova_io" className="text-sm text-muted-foreground hover:text-white">X</a>
              <a href="https://discord.gg/prova" className="text-sm text-muted-foreground hover:text-white">Discord</a>
            </div>
          </div>

          {Object.entries(sections).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 Prova. All rights reserved. Apache 2.0.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
          <p className="max-w-xs text-center">
            NOT affiliated with or endorsed by the Solana Foundation. Solana® is a registered trademark.
          </p>
        </div>
      </div>
    </footer>
  );
}
