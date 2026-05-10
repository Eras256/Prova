'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets as usePrivySolanaWallets } from '@privy-io/react-auth/solana';
import { Button } from '@prova/ui';
import { Wallet, LogOut, User } from 'lucide-react';
import { shortPubkey } from '@/lib/solana/events';
import { useI18n } from '../i18n-provider';

export function WalletButton({ size = 'default' }: { size?: 'default' | 'sm' | 'lg' }) {
  const { publicKey: standardPubkey, disconnect, connected } = useWallet();
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { wallets } = usePrivySolanaWallets();
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return (
      <Button size={size} variant="outline" className="gap-2" disabled>
        <Wallet className="h-4 w-4" />
        {t('connectWallet')}
      </Button>
    );
  }

  const privySolanaWallet = wallets.find(
    (w) => (w as { standardWallet?: { name?: string } }).standardWallet?.name === 'Privy'
  );
  const privyAddress = privySolanaWallet
    ? (privySolanaWallet as unknown as { address: string }).address
    : null;

  const isConnected = (connected && standardPubkey) || authenticated;

  const handleLogout = () => {
    if (connected) disconnect().catch(() => {});
    if (authenticated) logout();
  };

  if (isConnected) {
    const label = authenticated
      ? user?.email?.address?.split('@')[0] ?? (privyAddress ? shortPubkey(privyAddress, 4, 4) : 'User')
      : standardPubkey
        ? shortPubkey(standardPubkey, 4, 4)
        : '';

    return (
      <div className="flex items-center gap-1.5">
        <Button size={size} variant="outline" className="gap-2 font-mono text-xs">
          {authenticated ? <User className="h-3.5 w-3.5" /> : <Wallet className="h-3.5 w-3.5" />}
          {label}
        </Button>
        <Button
          size={size}
          variant="ghost"
          className="px-2"
          onClick={handleLogout}
          aria-label="Disconnect"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      size={size}
      variant="outline"
      className="gap-2"
      onClick={login}
    >
      <Wallet className="h-4 w-4" />
      {t('connectWallet')}
    </Button>
  );
}
