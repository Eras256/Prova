import Link from 'next/link';
import { Separator } from '@prova/ui';

const sections = {
  Product: [
    { label: 'How it works', href: '/product/how' },
    { label: 'SDK', href: '/product/sdk' },
    { label: 'Security', href: '/product/security' },
    { label: 'Privacy mode', href: '/product/privacy' },
  ],
  Developers: [
    { label: 'Quick start', href: '/developers/quick-start' },
    { label: 'Documentation', href: '/developers/docs' },
    { label: 'API reference', href: '/developers/api' },
    { label: 'Examples', href: '/developers/examples' },
  ],
  Solutions: [
    { label: 'For compliance', href: '/solutions/compliance' },
    { label: 'For operators', href: '/solutions/operators' },
    { label: 'For legal', href: '/solutions/legal' },
    { label: 'For auditors', href: '/solutions/auditors' },
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
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Prova — home" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center bg-primary font-display text-xs leading-none text-primary-foreground"
              >
                P
              </span>
              <span className="font-display text-sm uppercase tracking-tight text-foreground">PROVA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A verifiable record of every AI agent action on Solana. Sign every action. Verify any of them, forever.
            </p>
            <div className="mt-5 flex gap-5">
              {[
                { label: 'GitHub', href: 'https://github.com/prova-io/prova' },
                { label: 'X', href: 'https://x.com/prova_io' },
                { label: 'Discord', href: 'https://discord.gg/prova' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(sections).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h3 className="mb-4 font-pixel text-[12px] uppercase tracking-wider text-foreground">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground md:flex-row md:items-center">
          <p className="font-mono uppercase tracking-wider">© 2026 Prova Labs · Apache 2.0 · Built in the open</p>
          <div className="flex gap-5 font-mono uppercase tracking-wider">
            <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
          </div>
          <p className="max-w-xs md:text-right">
            Independent project. Not affiliated with the Solana Foundation. Solana® is a registered trademark.
          </p>
        </div>
      </div>
    </footer>
  );
}
