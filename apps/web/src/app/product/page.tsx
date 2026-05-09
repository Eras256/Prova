import type { Metadata } from 'next';
import { ProductContent } from './product-content';

export const metadata: Metadata = {
  title: 'Product — how Prova issues every receipt',
  description:
    'Architecture, SDK internals, threat model, and privacy mode. Everything that makes Prova attestations forensic-grade.',
  alternates: { canonical: '/product' },
};

export default function ProductPage() {
  return <ProductContent />;
}
