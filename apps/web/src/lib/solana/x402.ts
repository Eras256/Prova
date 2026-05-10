import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { type WalletContextState } from '@solana/wallet-adapter-react';

export const X402_TREASURY = new PublicKey(
  process.env.NEXT_PUBLIC_X402_TREASURY ?? '6mf8TTQvSEEhAcC7uxuiWQn8JWGYFMokEAz8c2acjASK'
);

// En devnet, 1000 lamports (~$0) es simbólico — el flujo es lo importante.
// En mainnet calcularemos lamports dinámicos para igualar $0.01.
export const X402_LAMPORTS = 1000;
export const X402_DISPLAY_PRICE = '$0.01';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export type X402Receipt = {
  txSignature: string;
  payer: string;
  amount: number; // lamports
  resourceId: string;
  paidAt: number;
};

const STORAGE_KEY = 'prova:x402';

function loadAll(): Record<string, X402Receipt> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, X402Receipt>) : {};
  } catch {
    return {};
  }
}

function saveAll(map: Record<string, X402Receipt>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage lleno o deshabilitado — silencioso
  }
}

export function getReceipt(resourceId: string): X402Receipt | null {
  return loadAll()[resourceId] ?? null;
}

export function isUnlocked(resourceId: string): boolean {
  return getReceipt(resourceId) !== null;
}

export async function payX402(
  connection: Connection,
  wallet: { publicKey: PublicKey | null; signTransaction?: (tx: Transaction) => Promise<Transaction> } | null,
  resourceId: string
): Promise<X402Receipt> {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

  const tx = new Transaction({
    feePayer: wallet.publicKey,
    blockhash,
    lastValidBlockHeight,
  })
    .add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: X402_TREASURY,
        lamports: X402_LAMPORTS,
      })
    )
    .add(
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [],
        data: Buffer.from(`x402:${resourceId}`),
      })
    );

  const signed = await wallet.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
  });
  await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed');

  const receipt: X402Receipt = {
    txSignature: sig,
    payer: wallet.publicKey.toBase58(),
    amount: X402_LAMPORTS,
    resourceId,
    paidAt: Date.now(),
  };

  const all = loadAll();
  all[resourceId] = receipt;
  saveAll(all);

  return receipt;
}
