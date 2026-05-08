import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@prova/ui';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Product', description: 'How Prova works.' };

const sections = [
  { title: 'How It Works', desc: 'Architecture, sequence diagrams, and integration walkthrough.', href: '/product/how', badge: 'Core' },
  { title: 'SDK', desc: 'TypeScript and Rust SDK reference.', href: '/product/sdk', badge: 'Developers' },
  { title: 'Security', desc: 'Threat model, STRIDE analysis, audit reports.', href: '/product/security', badge: 'Trust' },
  { title: 'Privacy', desc: 'Privacy mode with Vanish Core integration.', href: '/product/privacy', badge: 'Compliance' },
];

export default function ProductPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white">Product</h1>
        <p className="mt-4 text-lg text-muted-foreground">Deep dives into every aspect of Prova.</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <Link key={s.title} href={s.href} className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <Badge variant="secondary" className="mb-3">{s.badge}</Badge>
              <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
