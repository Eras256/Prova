import type { Metadata } from 'next';
import { DocsContent } from './docs-content';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Everything you need to integrate Prova into your AI agents.',
};

export default function DocsPage() {
  return <DocsContent />;
}
