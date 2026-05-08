import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@prova/ui';
import { BookOpen, Code2, Puzzle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developers',
  description: 'Everything you need to integrate Prova into your AI agent.',
};

const resources = [
  { icon: BookOpen, title: 'Quick Start', desc: 'Issue your first attestation in 2 minutes.', href: '/developers/quick-start' },
  { icon: Code2, title: 'API Reference', desc: 'Full REST API documentation with try-it-now.', href: '/developers/api' },
  { icon: Puzzle, title: 'SDK Reference', desc: 'TypeScript and Rust SDK docs.', href: '/developers/sdks' },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white">Developer Hub</h1>
        <p className="mt-4 text-lg text-muted-foreground">Everything you need to build with Prova.</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {resources.map((r) => (
            <Card key={r.title} className="group transition-colors hover:border-primary/50">
              <CardHeader>
                <r.icon className="mb-2 h-6 w-6 text-primary" />
                <CardTitle className="text-lg">{r.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">{r.desc}</p>
                <Button variant="ghost" size="sm" asChild className="gap-1 p-0 text-primary">
                  <Link href={r.href}>Learn more <ArrowRight className="h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-white">Install</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-4 font-mono text-sm">
              <div className="mb-2 text-xs text-muted-foreground">TypeScript / JavaScript</div>
              <span className="text-secondary">pnpm add @prova/sdk</span>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 font-mono text-sm">
              <div className="mb-2 text-xs text-muted-foreground">Rust</div>
              <span className="text-secondary">{'prova-sdk = "0.1"'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
