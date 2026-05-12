import type { Metadata } from 'next';
import { AuditorsContent } from './auditors-content';

export const metadata: Metadata = {
  title: 'For Auditors & Underwriters',
  description: 'Price agentic risk with deterministic data and transparent verification.',
};

export default function AuditorsPage() {
  return <AuditorsContent />;
}
