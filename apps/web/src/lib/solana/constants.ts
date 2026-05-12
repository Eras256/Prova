import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROVA_PROGRAM_ID ?? 'G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1'
);

// En el navegador usamos el proxy /api/rpc para no exponer la API key de Helius en el bundle.
// En el servidor (SSR / RSC) usamos la URL directa via HELIUS_RPC_URL (sin prefijo NEXT_PUBLIC_).
function resolveRpcUrl(): string {
  const direct =
    process.env.HELIUS_RPC_URL ??
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    'https://api.devnet.solana.com';

  if (typeof window === 'undefined') return direct;

  // En el browser, usar el proxy relativo si está disponible.
  // Requiere que /api/rpc esté desplegada (Next.js dev y producción).
  return window.location.origin + '/api/rpc';
}

export const RPC_URL = resolveRpcUrl();

// La URL de WebSocket para suscripciones onLogs siempre usa la URL directa de Helius
// (el proxy HTTP no soporta WebSocket nativo).
export const WSS_URL = (() => {
  const direct =
    process.env.HELIUS_RPC_URL ??
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    'https://api.devnet.solana.com';
  return direct.replace(/^https?:\/\//, (m) => (m === 'https://' ? 'wss://' : 'ws://'));
})();

export const NETWORK =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'mainnet-beta' | 'devnet' | 'testnet') ?? 'devnet';

export const AGENT_SEED = Buffer.from('prova_agent');

export function deriveAgentPda(operator: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([AGENT_SEED, operator.toBuffer()], PROGRAM_ID);
}

export function explorerTxUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${NETWORK}`;
}

export function explorerAccountUrl(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=${NETWORK}`;
}
