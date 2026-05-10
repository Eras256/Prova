'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { RPC_URL } from '@/lib/solana/constants';
import { I18nProvider } from './i18n-provider';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';
import { NETWORK } from '@/lib/solana/constants';

import '@solana/wallet-adapter-react-ui/styles.css';

// Privy exige una RPC explícita para cada chain que se use en externalWallets/embeddedWallets.
// Derivamos WSS del RPC_URL reemplazando el esquema.
function wssFromHttp(url: string): string {
  return url.replace(/^https?:\/\//, (m) => (m === 'https://' ? 'wss://' : 'ws://'));
}

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
  const solanaRpcs = useMemo(
    () => ({
      [PRIVY_CHAIN]: {
        rpc: createSolanaRpc(RPC_URL),
        rpcSubscriptions: createSolanaRpcSubscriptions(wssFromHttp(RPC_URL)),
      },
    }),
    []
  );

  const inner = (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ConnectionProvider endpoint={RPC_URL} config={{ commitment: 'confirmed' }}>
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
        solana: { rpcs: solanaRpcs },
      }}
    >
      {inner}
    </PrivyProvider>
  );
}
