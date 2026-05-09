import type { Metadata } from 'next';
import { PricingContent } from './pricing-content';

export const metadata: Metadata = {
  title: 'Pricing — pay only for the receipts you sign',
  description:
    'Free for the first 100 attestations. From $0.0005 per receipt after that. No hidden fees, no minimums, no sales call to start.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return <PricingContent />;
}
