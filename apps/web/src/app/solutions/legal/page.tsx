import type { Metadata } from 'next';
import { LegalContent } from './legal-content';

export const metadata: Metadata = {
  title: 'For Legal Teams',
  description: 'Cryptographic proof that meets FRE 901 standards for court admissibility.',
};

export default function LegalPage() {
  return <LegalContent />;
}
