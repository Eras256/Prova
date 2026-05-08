import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product — how Prova issues every receipt',
  description:
    'Architecture, SDK internals, threat model, and privacy mode. Everything that makes Prova attestations forensic-grade.',
  alternates: { canonical: '/product' },
};

const sections = [
  {
    n: '01',
    tag: 'Core',
    title: 'How it works',
    desc: 'Architecture, sequence diagrams, and a walkthrough from agent action to on-chain receipt.',
    href: '/product/how',
  },
  {
    n: '02',
    tag: 'Developers',
    title: 'SDK',
    desc: 'TypeScript and Rust SDK reference. Same surface, same guarantees, both Apache 2.0.',
    href: '/product/sdk',
  },
  {
    n: '03',
    tag: 'Trust',
    title: 'Security',
    desc: 'STRIDE threat model, key custody, audit reports, and bug bounty.',
    href: '/product/security',
  },
  {
    n: '04',
    tag: 'Compliance',
    title: 'Privacy mode',
    desc: 'Selective disclosure with Vanish Core — prove an action happened without leaking what it was.',
    href: '/product/privacy',
  },
];

export default function ProductPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Product</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">How a single</span>
              <span className="block">agent action</span>
              <span className="mt-2 block text-muted-foreground">becomes forensic-</span>
              <span className="block text-muted-foreground">grade evidence.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Four short tours through the parts of Prova that matter most. Engineers, security teams, and compliance reviewers all get a way in.
            </p>
          </div>
        </div>

        <ol className="mt-20 border-t border-border">
          {sections.map((s) => (
            <li key={s.n} className="border-b border-border">
              <Link
                href={s.href}
                className="group grid gap-6 py-12 transition-colors lg:grid-cols-[auto_auto_1fr_2fr_auto] lg:items-baseline lg:gap-12 lg:py-14"
              >
                <span className="font-mono text-xs text-primary">{s.n}</span>
                <span className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
                  {s.tag}
                </span>
                <h2 className="font-display text-xl uppercase text-foreground transition-colors group-hover:text-primary lg:text-2xl">
                  {s.title}
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">{s.desc}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
