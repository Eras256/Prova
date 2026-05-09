import type { Metadata } from 'next';
import { OperatorsContent } from './operators-content';

export const metadata: Metadata = { title: 'For AI Agent Operators', description: 'Why every agent needs behavior attestations.' };

export default function OperatorsPage() {
  return <OperatorsContent />;
}
