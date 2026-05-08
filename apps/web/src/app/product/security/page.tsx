import type { Metadata } from 'next';
import { Badge } from '@prova/ui';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Security Model', description: 'Prova threat model and security design.' };

const threats = [
  { t: 'Spoofing', m: 'Ed25519 signature verification on-chain — every attestation must be signed by the agent key.' },
  { t: 'Tampering', m: 'Immutable Solana accounts — no update instruction exists for attestation accounts.' },
  { t: 'Repudiation', m: 'Cryptographic signature linked to agent PDA — agent cannot deny issuance.' },
  { t: 'Information Disclosure', m: 'Privacy mode via Vanish Core opt-in — payload hash is public but content is encrypted.' },
  { t: 'Denial of Service', m: 'Fee-based prioritization — spam is economically bounded by SOL fees.' },
  { t: 'Elevation of Privilege', m: 'Authority checks in every instruction — no admin backdoors in program code.' },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <ShieldCheck className="mb-4 h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold text-white">Security Model</h1>
        <p className="mt-4 text-muted-foreground">Prova was designed with STRIDE analysis from day one. Every threat vector has a mitigating control.</p>

        <h2 className="mt-12 text-2xl font-bold text-white">STRIDE Threat Model</h2>
        <div className="mt-6 space-y-4">
          {threats.map((th) => (
            <div key={th.t} className="rounded-xl border border-border bg-surface p-5">
              <Badge variant="outline" className="mb-2">{th.t}</Badge>
              <p className="text-sm text-muted-foreground">{th.m}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface p-6">
          <h3 className="font-semibold text-white">Audit Status</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            External security audit by Otter Security / Halborn is planned pre-mainnet. Bug bounty program will launch at mainnet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            To report a security issue: <a href="mailto:security@prova.io" className="text-primary hover:underline">security@prova.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}
