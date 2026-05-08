import type { Metadata } from 'next';
import { SearchInput } from '@/components/explorer/search-input';
import { AttestationFeed } from '@/components/explorer/attestation-feed';

export const metadata: Metadata = {
  title: 'Forensic Explorer',
  description: 'Search and verify AI agent behavior attestations on Solana.',
};

export default function ExplorerPage() {
  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">Forensic Explorer</h1>
          <p className="mt-4 text-muted-foreground">
            Search, verify, and audit AI agent behavior attestations on Solana.
          </p>
        </div>
        <SearchInput />
        <AttestationFeed />
      </div>
    </div>
  );
}
