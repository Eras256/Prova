import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Prova — Cryptographic Receipts for the Agentic Internet',
    template: '%s | Prova',
  },
  description:
    'Prova issues verifiable, signed, immutable receipts of every AI agent action on Solana. Built on Solana Attestation Service.',
  keywords: ['AI agents', 'Solana', 'attestation', 'blockchain', 'audit trail', 'compliance'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prova.io',
    siteName: 'Prova',
    title: 'Prova — Cryptographic Receipts for the Agentic Internet',
    description: 'Behavior attestation layer for AI agents on Solana.',
  },
  twitter: { card: 'summary_large_image', title: 'Prova', description: 'Cryptographic receipts for the agentic internet.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
