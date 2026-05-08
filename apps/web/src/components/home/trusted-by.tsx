const partners = ['Solana Attestation Service', 'Helius LaserStream', 'Vanish Core', 'Coinbase x402', 'Phantom Connect', 'Squads Multisig'];

export function TrustedBy() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-center text-sm text-muted-foreground">Built on the best Solana infrastructure</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {partners.map((p) => (
            <div key={p} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground">
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
