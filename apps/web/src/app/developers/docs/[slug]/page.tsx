import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { docsRegistry } from '../content';
import { docsFlat } from '../docs-nav';
import { DocsContent } from '../docs-content';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return docsFlat.filter((d) => d.slug !== '').map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = docsRegistry[slug];
  if (!doc) return { title: 'Documentation' };
  return {
    title: `${doc.EN.title} — Docs`,
    description: doc.EN.intro,
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  if (!docsRegistry[slug]) notFound();
  return <DocsContent slug={slug} />;
}
