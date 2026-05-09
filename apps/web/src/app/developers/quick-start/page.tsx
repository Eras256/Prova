import type { Metadata } from 'next';
import { QuickStartContent } from './quick-start-content';

export const metadata: Metadata = {
  title: 'Quick Start',
  description: 'Issue your first behavior attestation in minutes.',
};

export default function QuickStartPage() {
  return <QuickStartContent />;
}
