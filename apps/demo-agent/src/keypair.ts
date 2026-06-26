import { createHash } from 'crypto';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Parsea un secret key desde una variable de entorno. Acepta dos formatos:
 *  - Array JSON de bytes: "[12,34,...]" (formato de `solana-keygen`)
 *  - String base58: "5J3..." (formato de Phantom export)
 */
export function parseKeypair(raw: string): Keypair {
  const trimmed = raw.trim();
  if (trimmed.startsWith('[')) {
    const bytes = Uint8Array.from(JSON.parse(trimmed) as number[]);
    return Keypair.fromSecretKey(bytes);
  }
  return Keypair.fromSecretKey(bs58.decode(trimmed));
}

/**
 * Deriva un keypair determinista a partir de un seed string. Permite que la
 * identidad del agente (agentId / PDA) sea estable entre reinicios sin tener
 * que custodiar un secret extra: el agente solo firma action hashes off-chain
 * (Ed25519), nunca paga fees, así que no necesita fondos.
 */
export function deterministicKeypair(seed: string): Keypair {
  const digest = createHash('sha256').update(seed).digest();
  return Keypair.fromSeed(Uint8Array.from(digest.subarray(0, 32)));
}
