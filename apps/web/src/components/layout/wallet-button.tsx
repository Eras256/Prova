'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@prova/ui';
import { Wallet, LogOut } from 'lucide-react';
import { shortPubkey } from '@/lib/solana/events';

export function WalletButton({ size = 'default' }: { size?: 'default' | 'sm' | 'lg' }) {
  const { publicKey, disconnect, connecting, connected, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  // Evita hydration mismatch — la wallet sólo existe en cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button size={size} variant="outline" className="gap-2" disabled>
        <Wallet className="h-4 w-4" />
        Connect wallet
      </Button>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-1.5">
        <Button size={size} variant="outline" className="gap-2 font-mono text-xs" onClick={() => setVisible(true)}>
          {wallet?.adapter.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="h-3.5 w-3.5" />
          )}
          {shortPubkey(publicKey, 4, 4)}
        </Button>
        <Button
          size={size}
          variant="ghost"
          className="px-2"
          onClick={() => disconnect().catch(() => {})}
          aria-label="Disconnect wallet"
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
      onClick={() => setVisible(true)}
      disabled={connecting}
    >
      <Wallet className="h-4 w-4" />
      {connecting ? 'Connecting…' : 'Connect wallet'}
    </Button>
  );
}
