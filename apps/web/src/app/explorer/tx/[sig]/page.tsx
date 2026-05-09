import type { Metadata } from 'next';
import { TxDetail } from '@/components/explorer/tx-detail';

export const metadata: Metadata = {
  title: 'Transaction · Forensic Explorer',
  description: 'Cryptographic receipt detail — every field, signed and verifiable on Solana.',
  robots: { index: false, follow: true },
};

export default async function ExplorerTxPage({
  params,
}: {
  params: Promise<{ sig: string }>;
}) {
  const { sig } = await params;
  return <TxDetail signature={decodeURIComponent(sig)} />;
}
