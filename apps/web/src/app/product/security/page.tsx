import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security Model — Prova',
  description: 'Prova threat model and security design.',
};

const threats = [
  { t: 'Spoofing',                m: 'Ed25519 signature verification on-chain — every attestation must be signed by the agent key.' },
  { t: 'Tampering',               m: 'Immutable Solana accounts — no update instruction exists for attestation accounts.' },
  { t: 'Repudiation',             m: 'Cryptographic signature linked to agent PDA — agent cannot deny issuance.' },
  { t: 'Information Disclosure',  m: 'Privacy mode via Vanish Core opt-in — payload hash is public but content is encrypted.' },
  { t: 'Denial of Service',       m: 'Fee-based prioritization — spam is economically bounded by SOL fees.' },
  { t: 'Elevation of Privilege',  m: 'Authority checks in every instruction — no admin backdoors in program code.' },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Security</p>
          </div>
          <div>
            <ShieldCheck className="mb-4 h-10 w-10 text-primary" strokeWidth={1.5} />
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              Security Model
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Prova was designed with STRIDE analysis from day one. Every threat vector has a mitigating control.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">STRIDE</p>
          </div>
          <div className="space-y-px border border-border">
            {threats.map((th) => (
              <div key={th.t} className="border-b border-border bg-surface px-5 py-4 last:border-b-0">
                <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">{th.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{th.m}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">Audit</p>
          </div>
          <div className="border border-border bg-surface p-6">
            <p className="font-display text-base uppercase text-foreground">Audit Status</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              External security audit by Otter Security / Halborn is planned pre-mainnet. Bug bounty program will launch at mainnet.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              To report a security issue:{' '}
              <a href="mailto:security@prova.io" className="font-mono text-primary hover:text-foreground">
                security@prova.io
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
