import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Model — Prova',
  description: 'Prova threat model and security design.',
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
