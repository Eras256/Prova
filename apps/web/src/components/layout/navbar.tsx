import Link from 'next/link';
import { Button } from '@prova/ui';

const links = [
  { label: 'Product', href: '/product' },
  { label: 'Explorer', href: '/explorer' },
  { label: 'Developers', href: '/developers' },
  { label: 'Solutions', href: '/solutions/operators' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/developers/docs' },
];

export function Navbar() {
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

        <div className="hidden items-center gap-6 md:flex">
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

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/app/overview" className="font-mono text-xs uppercase tracking-wider">
              Sign in
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/developers/quick-start" className="font-mono text-xs uppercase tracking-wider">
              Start building
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
