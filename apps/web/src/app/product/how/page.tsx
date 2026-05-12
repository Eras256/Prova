import type { Metadata } from 'next';
import { HowContent } from './how-content';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Architecture and sequence diagrams for the Prova Protocol.',
};

export default function HowPage() {
  return <HowContent />;
}
