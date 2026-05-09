import type { Metadata } from 'next';
import { SdksContent } from './sdks-content';

export const metadata: Metadata = {
  title: 'SDK Reference — Prova',
  description: 'TypeScript SDK reference for prova-agent-sdk. ProvaClient writes attestations on-chain; ProvaApiClient queries the REST API.',
};

export default function SdksPage() {
  return <SdksContent />;
}
