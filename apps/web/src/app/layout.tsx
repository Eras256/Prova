import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Pixelify_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-pixel',
  display: 'swap',
});

const SITE_URL = 'https://www.theprova.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Prova — A verifiable record of every AI agent action on Solana',
    template: '%s · Prova',
  },
  description:
    'Prova issues a signed, on-chain receipt for every transaction, decision, and tool call your AI agent makes. Sub-second finality, less than a tenth of a cent, verifiable by anyone, forever.',
  applicationName: 'Prova',
  authors: [{ name: 'Prova Labs', url: SITE_URL }],
  creator: 'Prova Labs',
  publisher: 'Prova Labs',
  keywords: [
    'AI agents',
    'AI agent attestation',
    'Solana attestation service',
    'agent audit trail',
    'cryptographic receipts',
    'on-chain logging',
    'AI compliance',
    'EU AI Act',
    'agent forensics',
    'Solana SAS',
    'agentic internet',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Prova',
    title: 'Prova — A verifiable record of every AI agent action on Solana',
    description:
      'When your AI agent acts, prove it. Signed, on-chain receipts in under a second for less than a tenth of a cent.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Prova — cryptographic receipts for the agentic internet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prova — Cryptographic receipts for AI agent actions',
    description: 'When your AI agent acts, prove it. Signed, on-chain, in under a second.',
    creator: '@theprovaxyz',
    site: '@theprovaxyz',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#0A0A0A' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Prova',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'Prova issues cryptographic, on-chain receipts for every action an AI agent takes, sealed on Solana by its own Anchor program with native Ed25519 verification.',
  sameAs: [
    'https://github.com/Eras256/Prova',
    'https://x.com/theprovaxyz',
    'https://discord.gg/prova',
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Prova',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description:
    'SDK and infrastructure that issues signed, on-chain attestations for every AI agent action on Solana.',
  url: SITE_URL,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free tier — 100 attestations per month, no credit card required.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${pixelify.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </body>
    </html>
  );
}
