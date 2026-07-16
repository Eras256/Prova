'use client';
import { useState } from 'react';
import { SearchInput } from '@/components/explorer/search-input';
import { AttestationFeed } from '@/components/explorer/attestation-feed';
import { useI18n } from '@/components/i18n-provider';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@prova/ui';
import { Zap, Loader2, CheckCircle, AlertTriangle, Wallet } from 'lucide-react';
import { payX402, isUnlocked, X402_DISPLAY_PRICE } from '@/lib/solana/x402';

const RESOURCE_ID = 'explorer:premium:v1';

const content = {
  EN: {
    tag: 'Forensic Explorer',
    headline: ['Look up any', 'agent action.', 'Verify it yourself.'],
    desc: 'Search by attestation ID, agent key, transaction signature, or schema. Every result is verified on-chain in your browser — we never sit between you and the signature.',
    x402Tag: 'One-off query',
    x402Title: 'No account needed',
    x402Desc: 'Pay once with your wallet to unlock extended search and forensic PDF exports for this session. No sign-up, no subscription.',
    x402Btn: `Pay ${X402_DISPLAY_PRICE} · Unlock session`,
    x402Paying: 'Confirming on devnet…',
    x402Done: 'Session unlocked',
    x402ConnectFirst: 'Connect wallet first',
  },
  ES: {
    tag: 'Explorador Forense',
    headline: ['Busca cualquier', 'acción del agente.', 'Verifícalo tú mismo.'],
    desc: 'Busca por ID de atestación, clave de agente, firma de transacción o esquema. Cada resultado se verifica on-chain en tu navegador — nunca nos interponemos entre tú y la firma.',
    x402Tag: 'Consulta puntual',
    x402Title: 'Sin cuenta necesaria',
    x402Desc: 'Paga una vez con tu wallet para desbloquear búsqueda extendida y exportaciones forenses PDF en esta sesión. Sin registro, sin suscripción.',
    x402Btn: `Pagar ${X402_DISPLAY_PRICE} · Desbloquear sesión`,
    x402Paying: 'Confirmando en devnet…',
    x402Done: 'Sesión desbloqueada',
    x402ConnectFirst: 'Conecta primero tu wallet',
  },
  ZH: {
    tag: '法证浏览器',
    headline: ['查找任何', '代理操作。', '亲自验证。'],
    desc: '通过证明 ID、代理密钥、交易签名或模式进行搜索。每个结果都会在你的浏览器中进行链上验证——我们绝不会介于你和签名之间。',
    x402Tag: '一次性查询',
    x402Title: '无需账户',
    x402Desc: '用钱包支付一次，即可解锁本次会话的扩展搜索和取证 PDF 导出功能。无需注册，无需订阅。',
    x402Btn: `支付 ${X402_DISPLAY_PRICE} · 解锁会话`,
    x402Paying: '正在 devnet 上确认…',
    x402Done: '会话已解锁',
    x402ConnectFirst: '请先连接钱包',
  },
};

function X402Banner() {
  const { lang } = useI18n();
  const t = content[lang];
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();

  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(() => isUnlocked(RESOURCE_ID));
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    if (!connected || !publicKey) {
      openWalletModal(true);
      return;
    }
    setPaying(true);
    setError(null);
    try {
      await payX402(connection, { publicKey, signTransaction }, RESOURCE_ID);
      setPaid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (paid) {
    return (
      <div className="mb-8 flex items-center gap-3 border border-primary/40 bg-primary/4 px-5 py-4 text-sm text-primary">
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span className="font-pixel text-[12px] uppercase tracking-wider">{t.x402Done}</span>
      </div>
    );
  }

  return (
    <div className="mb-8 border border-border bg-background p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">{t.x402Tag}</p>
          <p className="mt-1 font-display text-lg uppercase text-foreground">{t.x402Title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t.x402Desc}</p>
          {error && (
            <p className="mt-3 flex items-center gap-2 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          )}
        </div>
        <Button
          onClick={pay}
          disabled={paying}
          className="gap-2 font-mono uppercase tracking-wider text-xs sm:text-sm px-4 py-2.5 sm:px-6 sm:py-3 w-full lg:w-auto justify-center"
        >
          {paying ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> {t.x402Paying}</>
          ) : !connected ? (
            <><Wallet className="h-4 w-4" /> {t.x402ConnectFirst}</>
          ) : (
            <><Zap className="h-4 w-4" /> {t.x402Btn}</>
          )}
        </Button>
      </div>
    </div>
  );
}

export function ExplorerContent() {
  const { lang } = useI18n();
  const t = content[lang];
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">{t.headline[0]}</span>
              <span className="block">{t.headline[1]}</span>
              <span className="mt-2 block text-muted-foreground">{t.headline[2]}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <X402Banner />
          <SearchInput />
          <AttestationFeed />
        </div>
      </div>
    </div>
  );
}
