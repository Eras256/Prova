import type { Metadata } from 'next';
import { ExplorerContent } from './explorer-content';

export const metadata: Metadata = {
  title: 'Forensic Explorer — search and verify any agent attestation',
  description:
    'Public, on-chain audit trail for AI agents on Solana. Look up any attestation by ID, agent key, transaction signature, or schema.',
  alternates: { canonical: '/explorer' },
};

export default function ExplorerPage() {
  return <ExplorerContent />;
}
