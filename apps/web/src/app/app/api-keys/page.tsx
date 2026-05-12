import { ApiKeysClient } from './api-keys-client';

export const metadata = {
  title: 'API Keys — Prova',
  description: 'Generate and manage your Prova API keys to access the REST API from your agents.',
};

export default function ApiKeysPage() {
  return <ApiKeysClient />;
}
