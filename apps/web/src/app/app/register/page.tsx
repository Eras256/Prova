import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Register a new agent',
  description: 'Generate an agent keypair, register it on-chain, and start issuing forensic-grade attestations.',
  robots: { index: false, follow: false },
};

const RegisterAgent = dynamic(
  () => import('@/components/app/register-agent').then((m) => m.RegisterAgent),
  { ssr: false }
);

export default function RegisterAgentPage() {
  return <RegisterAgent />;
}
