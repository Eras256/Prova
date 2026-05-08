import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@prova/ui', '@prova/core'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default config;
