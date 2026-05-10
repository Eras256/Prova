import type { Metadata } from 'next';
import { DevelopersContent } from './developers-content';

export const metadata: Metadata = {
  title: 'Developers — ship your first attestation in 2 minutes',
  description:
    'TypeScript SDK, full REST API, copy-paste examples. Everything you need to wrap an AI agent action in a signed, on-chain receipt.',
  alternates: { canonical: '/developers' },
};

export default function DevelopersPage() {
  return <DevelopersContent />;
}
