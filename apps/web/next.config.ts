import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@prova/ui', '@prova/core'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        // Solana Actions spec requiere estas cabeceras en los endpoints de Action
        source: '/api/actions/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Accept' },
          { key: 'X-Action-Version', value: '2.1.3' },
          { key: 'X-Blockchain-Ids', value: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1' }, // devnet
        ],
      },
      {
        // actions.json manifest
        source: '/api/actions.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default config;
