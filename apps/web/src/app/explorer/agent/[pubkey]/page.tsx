import type { Metadata } from 'next';
import { AgentDetail } from '@/components/explorer/agent-detail';

export const metadata: Metadata = {
  title: 'Agent · Forensic Explorer',
  description: 'Full audit trail for a Prova-registered AI agent on Solana.',
  robots: { index: false, follow: true },
};

export default async function ExplorerAgentPage({
  params,
}: {
  params: Promise<{ pubkey: string }>;
}) {
  const { pubkey } = await params;
  return <AgentDetail pubkey={decodeURIComponent(pubkey)} />;
}
