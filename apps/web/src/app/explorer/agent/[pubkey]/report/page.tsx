import type { Metadata } from 'next';
import { ForensicAgentReport } from '@/components/explorer/forensic-agent-report';

export const metadata: Metadata = {
  title: 'Forensic report · Agent',
  robots: { index: false, follow: false },
};

export default async function AgentReportPage({
  params,
}: {
  params: Promise<{ pubkey: string }>;
}) {
  const { pubkey } = await params;
  return <ForensicAgentReport pubkey={decodeURIComponent(pubkey)} />;
}
