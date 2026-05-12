import type { Metadata } from 'next';
import { ComplianceContent } from './compliance-content';

export const metadata: Metadata = {
  title: 'For Compliance',
  description: 'Map autonomous actions to EU AI Act and regulatory frameworks.',
};

export default function CompliancePage() {
  return <ComplianceContent />;
}
