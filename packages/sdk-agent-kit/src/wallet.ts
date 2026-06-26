// Enfoque A: decorador de BaseWallet (SAK v2). Captura la firma on-chain real
// de cada transacción firmada/enviada, sin importar qué plugin la produjo. Es
// el "cinturón de seguridad" que complementa a `attachProva`.

import type { BatchOptions, HostWallet, ProvaAttester } from './types';
import { createBatcher, type Batcher } from './batcher';

export interface ProvaWalletOptions {
  attester: ProvaAttester;
  batch?: BatchOptions;
  onError?: (error: unknown) => void;
}

export class ProvaWallet implements HostWallet {
  private readonly inner: HostWallet;
  private readonly attester: ProvaAttester;
  private readonly batcher: Batcher;

  constructor(inner: HostWallet, options: ProvaWalletOptions) {
    this.inner = inner;
    this.attester = options.attester;
    this.batcher = createBatcher(options.attester, options.batch, options.onError);
  }

  get publicKey(): { toBase58(): string } {
    return this.inner.publicKey;
  }

  signTransaction<T>(transaction: T): Promise<T> {
    return this.inner.signTransaction(transaction);
  }

  signAllTransactions<T>(transactions: T[]): Promise<T[]> {
    return this.inner.signAllTransactions(transactions);
  }

  signMessage(message: Uint8Array): Promise<Uint8Array> {
    return this.inner.signMessage(message);
  }

  async signAndSendTransaction<T>(transaction: T, options?: unknown): Promise<{ signature: string }> {
    const result = await this.inner.signAndSendTransaction(transaction, options);
    // Atestación NO bloqueante de la firma on-chain real.
    void this.captureSignature(result.signature).catch(() => {});
    return result;
  }

  /** Fuerza el envío de las atestaciones pendientes. */
  flush(): Promise<void> {
    return this.batcher.flush();
  }

  /** Detiene el batcher y hace un flush final. */
  stop(): Promise<void> {
    return this.batcher.stop();
  }

  private async captureSignature(signature: string): Promise<void> {
    const payload = { kind: 'transaction', signature, source: 'wallet' };
    const actionHash = await this.attester.hashAction(JSON.stringify(payload));
    this.batcher.add({ actionHash, actionType: 'Transaction' });
  }
}
