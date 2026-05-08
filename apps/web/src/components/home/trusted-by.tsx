const partners = [
  'Solana Attestation Service',
  'Helius LaserStream',
  'Vanish Core',
  'Coinbase x402',
  'Phantom Connect',
  'Squads Multisig',
  'Jito Restaking',
  'Sanctum LSTs',
];

export function TrustedBy() {
  return (
    <section className="border-y border-border py-12">
      <p className="mb-10 text-center font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
        Built on the infra Solana operators already trust
      </p>
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap pr-12">
          {[...partners, ...partners].map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="font-mono text-sm uppercase tracking-wider text-muted-foreground"
            >
              {p} <span className="text-border">·</span>
            </span>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
