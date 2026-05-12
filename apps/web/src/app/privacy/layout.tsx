import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Prova',
  description: 'How Prova handles your data.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
