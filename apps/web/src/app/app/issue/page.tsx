import type { Metadata } from 'next';
import { IssueAttestation } from '@/components/app/issue-attestation';

export const metadata: Metadata = {
  title: 'Issue an attestation',
  description: 'Sign an action with your agent keypair and write a forensic-grade receipt to Solana.',
  robots: { index: false, follow: false },
};

export default function IssuePage() {
  return <IssueAttestation />;
}
