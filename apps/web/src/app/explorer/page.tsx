import type { Metadata } from 'next';
import { SearchInput } from '@/components/explorer/search-input';
import { AttestationFeed } from '@/components/explorer/attestation-feed';

export const metadata: Metadata = {
  title: 'Forensic Explorer — search and verify any agent attestation',
  description:
    'Public, on-chain audit trail for AI agents on Solana. Look up any attestation by ID, agent key, transaction signature, or schema.',
  alternates: { canonical: '/explorer' },
};

export default function ExplorerPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Forensic Explorer</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">Look up any</span>
              <span className="block">agent action.</span>
              <span className="mt-2 block text-muted-foreground">Verify it yourself.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Search by attestation ID, agent key, transaction signature, or schema. Every result is verified on-chain in your browser — we never sit between you and the signature.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <SearchInput />
          <AttestationFeed />
        </div>
      </div>
    </div>
  );
}
