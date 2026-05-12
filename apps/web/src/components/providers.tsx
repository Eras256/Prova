'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { RPC_URL, WSS_URL } from '@/lib/solana/constants';
// ConnectionProvider de @solana/wallet-adapter-react y Privy necesitan la URL HTTP del RPC.
// Las suscripciones WebSocket usan WSS_URL (Helius directo — el proxy /api/rpc es HTTP-only).
import { I18nProvider } from './i18n-provider';
import { PrivyProvider } from '@privy-io/react-auth';
// NOTE: Full Privy wallet integration (embedded wallets + social) is roadmapped for Q3.
// For now, Privy is email-only; wallet connections use the standard Solana Wallet Adapter.

import '@solana/wallet-adapter-react-ui/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {

  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 2 } } })
  );

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  const inner = (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ConnectionProvider endpoint={RPC_URL} config={{ commitment: 'confirmed', wsEndpoint: WSS_URL }}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </I18nProvider>
    </QueryClientProvider>
  );

  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!privyAppId) return inner;

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'dark',
          accentColor: '#B0FF2C' as `#${string}`,
        },
        embeddedWallets: { solana: { createOnLogin: 'users-without-wallets' } },
        // Full Privy wallet + external wallet integration is roadmapped for Q3.
        // Wallet connections are handled by the standard Solana Wallet Adapter.
      }}
    >
      {inner}
    </PrivyProvider>
  );
}
