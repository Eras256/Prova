'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@prova/ui';
import { Lock, Loader2, X, Printer, ExternalLink, Wallet } from 'lucide-react';
import { payX402, getReceipt, type X402Receipt, X402_DISPLAY_PRICE, X402_LAMPORTS, X402_TREASURY } from '@/lib/solana/x402';
import { explorerTxUrl, NETWORK } from '@/lib/solana/constants';
import { shortPubkey } from '@/lib/solana/events';
import { usePrivyAnchorWallet } from '@/lib/solana/hooks';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    export: 'Export',
    openReport: 'Open forensic report',
    exportPrice: 'Export —',
    micropayment: 'x402 micropayment',
    payPerQuery: 'Pay per query',
    price: 'Price',
    lamports: 'lamports · devnet',
    treasury: 'Treasury',
    network: 'Network',
    wallet: 'Wallet',
    notConnected: 'Not connected',
    paymentFailed: 'Payment failed',
    confirming: 'Confirming…',
    connectWallet: 'Connect wallet',
    payAndUnlock: 'Pay',
    andUnlock: '& unlock',
    cancel: 'Cancel',
    footer: 'One-time payment · no account · receipt is on-chain'
  },
  ES: {
    export: 'Exportar',
    openReport: 'Abrir informe forense',
    exportPrice: 'Exportar —',
    micropayment: 'micropago x402',
    payPerQuery: 'Pago por consulta',
    price: 'Precio',
    lamports: 'lamports · devnet',
    treasury: 'Tesorería',
    network: 'Red',
    wallet: 'Billetera',
    notConnected: 'No conectada',
    paymentFailed: 'Pago fallido',
    confirming: 'Confirmando…',
    connectWallet: 'Conectar billetera',
    payAndUnlock: 'Pagar',
    andUnlock: 'y desbloquear',
    cancel: 'Cancelar',
    footer: 'Pago único · sin cuenta · el recibo está on-chain'
  },
  ZH: {
    export: '导出',
    openReport: '打开法证报告',
    exportPrice: '导出 —',
    micropayment: 'x402 微支付',
    payPerQuery: '按次查询付费',
    price: '价格',
    lamports: 'lamports · devnet',
    treasury: '金库',
    network: '网络',
    wallet: '钱包',
    notConnected: '未连接',
    paymentFailed: '支付失败',
    confirming: '确认中…',
    connectWallet: '连接钱包',
    payAndUnlock: '支付',
    andUnlock: '并解锁',
    cancel: '取消',
    footer: '一次性付款 · 无需账户 · 链上收据'
  }
};

export function ForensicExport({
  resourceId,
  resourceLabel,
  printPath,
}: {
  resourceId: string;
  resourceLabel: string;
  printPath: string;
}) {
  const { lang } = useI18n();
  const t = content[lang];
  const { connection } = useConnection();
  const wallet = useWallet();
  const privyWallet = usePrivyAnchorWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const activeWallet = wallet.publicKey ? wallet : privyWallet;

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState<X402Receipt | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    setReceipt(getReceipt(resourceId));
  }, [mounted, resourceId]);

  if (!mounted) {
    return (
      <Button size="sm" variant="outline" disabled className="gap-2 font-mono text-xs uppercase tracking-wider">
        <Lock className="h-3.5 w-3.5" />
        {t.export}
      </Button>
    );
  }

  const unlocked = receipt !== null;

  const handlePay = async () => {
    if (!activeWallet?.publicKey) {
      openWalletModal(true);
      return;
    }
    setPaying(true);
    setError(null);
    try {
      const r = await payX402(connection, activeWallet as any, resourceId);
      setReceipt(r);
      setOpen(false);
      window.open(printPath, '_blank', 'noopener,noreferrer');
    } catch (e) {
      setError(e instanceof Error ? e.message : t.paymentFailed);
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="gap-2 font-mono text-xs uppercase tracking-wider"
        onClick={() => (unlocked ? window.open(printPath, '_blank', 'noopener,noreferrer') : setOpen(true))}
      >
        {unlocked ? (
          <>
            <Printer className="h-3.5 w-3.5" />
            {t.openReport}
          </>
        ) : (
          <>
            <Lock className="h-3.5 w-3.5" />
            {t.exportPrice} {X402_DISPLAY_PRICE}
          </>
        )}
      </Button>

      {open && !unlocked && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-60 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md border border-border bg-background p-6 shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">{t.micropayment}</p>
                <h3 className="mt-1 font-display text-xl uppercase text-foreground">{t.payPerQuery}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">{resourceLabel}</p>

            <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
              <Row label={t.price}>
                <span className="font-display text-lg uppercase text-foreground">{X402_DISPLAY_PRICE}</span>
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                  ({X402_LAMPORTS.toLocaleString()} {t.lamports})
                </span>
              </Row>
              <Row label={t.treasury}>
                <span className="font-mono text-xs text-foreground">{shortPubkey(X402_TREASURY, 4, 4)}</span>
              </Row>
              <Row label={t.network}>
                <span className="font-pixel text-[11px] uppercase tracking-wider text-foreground">{NETWORK}</span>
              </Row>
              <Row label={t.wallet}>
                {activeWallet?.publicKey ? (
                  <span className="font-mono text-xs text-foreground">{shortPubkey(activeWallet.publicKey, 4, 4)}</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Wallet className="h-3.5 w-3.5" /> {t.notConnected}
                  </span>
                )}
              </Row>
            </dl>

            {error && (
              <p className="mt-4 border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <Button onClick={handlePay} disabled={paying} className="flex-1 font-mono uppercase tracking-wider">
                {paying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.confirming}
                  </>
                ) : !activeWallet?.publicKey ? (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    {t.connectWallet}
                  </>
                ) : (
                  `${t.payAndUnlock} ${X402_DISPLAY_PRICE} ${t.andUnlock}`
                )}
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                {t.cancel}
              </Button>
            </div>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {t.footer}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5">
      <dt className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
