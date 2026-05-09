import type { Metadata } from 'next';
import { RegisterAgent } from '@/components/app/register-agent';

export const metadata: Metadata = {
  title: 'Register a new agent',
  description: 'Generate an agent keypair, register it on-chain, and start issuing forensic-grade attestations.',
  robots: { index: false, follow: false },
};

export default function RegisterAgentPage() {
  return <RegisterAgent />;
}
