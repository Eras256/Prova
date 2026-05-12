import type { Metadata } from 'next';
import { ExamplesContent } from './examples-content';

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Code examples for integrating Prova with elizaOS, DeFi agents, and Anchor.',
};

export default function ExamplesPage() {
  return <ExamplesContent />;
}
