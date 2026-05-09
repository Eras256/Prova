import type { Metadata } from 'next';
import { ForensicTxReport } from '@/components/explorer/forensic-tx-report';

export const metadata: Metadata = {
  title: 'Forensic report · Transaction',
  robots: { index: false, follow: false },
};

export default async function TxReportPage({ params }: { params: Promise<{ sig: string }> }) {
  const { sig } = await params;
  return <ForensicTxReport signature={decodeURIComponent(sig)} />;
}
