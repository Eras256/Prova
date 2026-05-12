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
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

import { NETWORK } from '@/lib/solana/constants';

import '@solana/wallet-adapter-react-ui/styles.css';

const PRIVY_CHAIN: 'solana:mainnet' | 'solana:devnet' | 'solana:testnet' =
  NETWORK === 'mainnet-beta'
    ? 'solana:mainnet'
    : NETWORK === 'testnet'
      ? 'solana:testnet'
      : 'solana:devnet';


export function Providers({ children }: { children: React.ReactNode }) {


  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 2 } } })
  );

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);
  const solanaConnectors = useMemo(() => toSolanaWalletConnectors(), []);

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
        loginMethods: ['email', 'wallet'] as ('email' | 'wallet')[],
        appearance: {
          theme: 'dark',
          accentColor: '#B0FF2C' as `#${string}`,
          walletChainType: 'solana-only',
          showWalletLoginFirst: false,
        },
        embeddedWallets: { solana: { createOnLogin: 'users-without-wallets' } },
        externalWallets: { solana: { connectors: solanaConnectors } },
        // Remove custom solana RPCs to prevent Privy from failing to reach localhost proxy during auth
      }}
    >
      {inner}
    </PrivyProvider>
  );
}
