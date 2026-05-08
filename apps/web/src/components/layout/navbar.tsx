import Link from 'next/link';
import { Button } from '@prova/ui';
import { Shield } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-white">Prova</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/overview">Dashboard</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/developers/quick-start">Start Building</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
