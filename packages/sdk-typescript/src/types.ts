import type { Keypair, PublicKey } from '@solana/web3.js';
import type { ActionType } from '@prova/core';

// ─── Configuración ────────────────────────────────────────────────────────────

export interface ProvaClientConfig {
  /** URL del RPC Solana (devnet/mainnet). Usa Helius para mayor estabilidad. */
  rpcUrl: string;
  /** Keypair del agente. Firma cada action_hash off-chain vía Ed25519. */
  agentKeypair: Keypair;
  /** Program ID del contrato Prova. Por defecto el desplegado en devnet. */
  programId?: string;
}

// ─── Parámetros de operaciones ─────────────────────────────────────────────────

export interface RegisterAgentParams {
  /** Keypair del operador. Paga el rent de la cuenta y firma la tx. */
  operatorKeypair: Keypair;
  /** Raíz de política (Merkle root de 32 bytes). Default: ceros. */
  policyRoot?: Uint8Array;
}

export interface AttestParams {
  /** Keypair del operador. Paga los fees y firma la tx. */
  operatorKeypair: Keypair;
  /** Hash de 32 bytes del payload de la acción (sha256). */
  actionHash: Uint8Array;
  /** Tipo de acción. Default: 'transaction'. */
  actionType?: ActionType;
  /** Si es true el hash queda on-chain pero el payload off-chain (Vanish). */
  privacyMode?: boolean;
}

export interface BatchAttestEntry {
  actionHash: Uint8Array;
  actionType?: ActionType;
  privacyMode?: boolean;
}

export interface BatchAttestParams {
  operatorKeypair: Keypair;
  attestations: BatchAttestEntry[];
}

export interface RevokeAgentParams {
  operatorKeypair: Keypair;
}

export interface UpdatePolicyRootParams {
  operatorKeypair: Keypair;
  newRoot: Uint8Array;
}

// ─── Resultados ────────────────────────────────────────────────────────────────

export interface RegisterAgentResult {
  txSignature: string;
  agentPda: PublicKey;
  explorerUrl: string;
}

export interface AttestResult {
  txSignature: string;
  explorerUrl: string;
}

export interface AgentAccount {
  address: PublicKey;
  operator: PublicKey;
  agentId: Uint8Array;
  policyRoot: Uint8Array;
  attestationCount: number;
  createdAt: number;
  revoked: boolean;
  bump: number;
}

export interface AttestationRecord {
  txSignature: string;
  slot: number;
  agent: PublicKey;
  agentId: Uint8Array;
  actionType: ActionType;
  actionHash: Uint8Array;
  privacyMode: boolean;
  timestamp: number;
  signature: Uint8Array;
}

export type { ActionType };
