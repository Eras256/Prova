import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROVA_PROGRAM_ID ?? 'G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1'
);

export const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.devnet.solana.com';

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
