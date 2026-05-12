import type { Metadata } from 'next';
import { ApiContent } from './api-content';

export const metadata: Metadata = {
  title: 'API & MCP Reference',
  description: 'REST API endpoints and Model Context Protocol integrations for Prova.',
};

export default function ApiPage() {
  return <ApiContent />;
}
