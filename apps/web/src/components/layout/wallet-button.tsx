'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@prova/ui';
import { Wallet, LogOut, Mail, User } from 'lucide-react';
import { shortPubkey } from '@/lib/solana/events';
import { useI18n } from '../i18n-provider';

export function WalletButton({ size = 'default' }: { size?: 'default' | 'sm' | 'lg' }) {
  const { publicKey, disconnect, connecting, connected, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const { login, logout, authenticated, user, ready } = usePrivy();
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
    // Limpiar localStorage de la simulación anterior para no confundir
    localStorage.removeItem('prova_mock_email');
  }, []);

  if (!mounted || !ready) {
    return (
      <div className="flex items-center gap-2">
        <Button size={size} variant="outline" className="gap-2" disabled>
          <Wallet className="h-4 w-4" />
          {t('connectWallet')}
        </Button>
      </div>
    );
  }

  const handleLogout = () => {
    if (connected) disconnect().catch(() => {});
    if (authenticated) logout();
  };

  return (
    <>
      {(connected && publicKey) || authenticated ? (
        <div className="flex items-center gap-1.5">
          <Button size={size} variant="outline" className="gap-2 font-mono text-xs" onClick={() => !authenticated && setVisible(true)}>
            {authenticated ? (
              <>
                <User className="h-3.5 w-3.5" />
                {user?.email?.address ? user.email.address.split('@')[0] : 'User'}
              </>
            ) : (
              <>
                {wallet?.adapter.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="h-3.5 w-3.5" />
                )}
                {publicKey ? shortPubkey(publicKey, 4, 4) : ''}
              </>
            )}
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
      ) : (
        <div className="flex items-center gap-2">
          <Button
            size={size}
            variant="outline"
            className="gap-2"
            onClick={() => setVisible(true)}
            disabled={connecting}
          >
            <Wallet className="h-4 w-4" />
            {connecting ? t('connecting') : t('connectWallet')}
          </Button>
          
          <Button
            size={size}
            variant="secondary"
            className="hidden gap-2 md:flex"
            onClick={login}
          >
            <Mail className="h-4 w-4" />
            {t('emailLogin')}
          </Button>
        </div>
      )}
    </>
  );
}
