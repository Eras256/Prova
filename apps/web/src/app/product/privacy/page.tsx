import type { Metadata } from 'next';
import { PrivacyContent } from './privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Mode',
  description: 'Selective disclosure via Vanish Core.',
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
