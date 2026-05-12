'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@prova/ui';
import { Wallet, LogOut, User, Mail } from 'lucide-react';
import { shortPubkey } from '@/lib/solana/events';
import { useI18n } from '../i18n-provider';

/**
 * WalletButton — Dual connection strategy:
 *
 * 1. "Connect Wallet" opens the standard Solana Wallet Adapter modal
 *    (Phantom, Solflare, MetaMask Snap, etc.)
 *
 * 2. "Email Login" opens Privy in email-only mode for enterprise
 *    non-custodial embedded wallets.
 *
 * NOTE: Full Privy integration (wallet + email unified) is planned for Q3.
 */
export function WalletButton({ size = 'default' }: { size?: 'default' | 'sm' | 'lg' }) {
  const { publicKey: standardPubkey, disconnect, connected } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const { login: privyLogin, logout: privyLogout, authenticated, user, ready } = usePrivy();
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return (
      <div className="flex items-center gap-1.5">
        <Button size={size} variant="outline" className="gap-2" disabled>
          <Wallet className="h-4 w-4" />
          {t('connectWallet')}
        </Button>
        <Button size={size} variant="ghost" className="gap-2 opacity-50" disabled>
          <Mail className="h-4 w-4" />
          {t('emailLogin')}
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Connected state — show the active identity (wallet or email) + logout
  // ---------------------------------------------------------------------------
  const isWalletConnected = connected && standardPubkey;
  const isPrivyConnected = authenticated;

  if (isWalletConnected || isPrivyConnected) {
    const label = isWalletConnected
      ? shortPubkey(standardPubkey, 4, 4)
      : user?.email?.address?.split('@')[0] ?? 'User';

    const handleLogout = () => {
      if (connected) disconnect().catch(() => {});
      if (authenticated) privyLogout();
    };

    return (
      <div className="flex items-center gap-1.5">
        <Button size={size} variant="outline" className="gap-2 font-mono text-xs">
          {isWalletConnected ? <Wallet className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
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

  // ---------------------------------------------------------------------------
  // Disconnected state — two buttons: Wallet Adapter modal + Privy email-only
  // ---------------------------------------------------------------------------

  /** Opens the standard Solana Wallet Adapter modal (Phantom, Solflare, etc.) */
  const handleConnectWallet = () => {
    openWalletModal(true);
  };

  /**
   * Opens Privy login restricted to email only.
   * Full Privy integration (embedded wallets + social logins) is roadmapped for Q3.
   */
  const handleEmailLogin = () => {
    privyLogin({ loginMethods: ['email'] });
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button
        size={size}
        variant="outline"
        className="gap-2"
        onClick={handleConnectWallet}
      >
        <Wallet className="h-4 w-4" />
        {t('connectWallet')}
      </Button>
      <Button
        size={size}
        variant="ghost"
        className="gap-2"
        onClick={handleEmailLogin}
        title="Full Privy integration — Q3"
      >
        <Mail className="h-4 w-4" />
        {t('emailLogin')}
      </Button>
    </div>
  );
}
