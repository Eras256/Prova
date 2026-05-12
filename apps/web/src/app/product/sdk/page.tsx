import type { Metadata } from 'next';
import { SdkContent } from './sdk-content';

export const metadata: Metadata = {
  title: 'Agent SDK',
  description: 'ProvaClient on-chain + REST API. Built for elizaOS and native Solana agents.',
};

export default function SdkPage() {
  return <SdkContent />;
}
