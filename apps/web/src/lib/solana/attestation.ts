import {
  Keypair,
  PublicKey,
  Transaction,
  Ed25519Program,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js';
import { type Program, type AnchorProvider } from '@coral-xyz/anchor';
import nacl from 'tweetnacl';

export type ActionTypeName =
  | 'transaction'
  | 'decision'
  | 'modelInvocation'
  | 'toolCall'
  | 'resourceAccess'
  | 'policyCheck'
  | 'custom';

export const ACTION_TYPE_LABELS: Record<ActionTypeName, string> = {
  transaction: 'Transaction',
  decision: 'Decision',
  modelInvocation: 'Model Invocation',
  toolCall: 'Tool Call',
  resourceAccess: 'Resource Access',
  policyCheck: 'Policy Check',
  custom: 'Custom',
};

// Anchor enum encoding: { variantName: {} }
function actionTypeToVariant(t: ActionTypeName): Record<string, Record<string, never>> {
  return { [t]: {} };
}

export function parseKeypairJson(text: string): Keypair {
  const arr = JSON.parse(text);
  if (!Array.isArray(arr) || arr.length !== 64 || !arr.every((n) => typeof n === 'number' && n >= 0 && n < 256)) {
    throw new Error('Invalid keypair JSON: expected an array of 64 bytes (Solana CLI format)');
  }
  return Keypair.fromSecretKey(Uint8Array.from(arr));
}

export async function sha256(input: string | Uint8Array): Promise<Uint8Array> {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  // SubtleCrypto requires an explicit ArrayBuffer (not SharedArrayBuffer)
  const buf = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buf).set(bytes);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return new Uint8Array(digest);
}

export function parseHex32(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, '').replace(/\s/g, '');
  if (clean.length !== 64) throw new Error('Expected 32 bytes (64 hex chars)');
  if (!/^[0-9a-fA-F]+$/.test(clean)) throw new Error('Invalid hex characters');
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function bytesToHex(b: Uint8Array): string {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

export type IssueParams = {
  program: Program;
  operator: PublicKey;
  agentKeypair: Keypair;
  actionHash: Uint8Array; // 32 bytes
  actionType: ActionTypeName;
  privacyMode: boolean;
};

export async function issueAttestation(params: IssueParams): Promise<{ txSignature: string }> {
  const { program, operator, agentKeypair, actionHash, actionType, privacyMode } = params;
  if (actionHash.length !== 32) throw new Error('action_hash must be exactly 32 bytes');

  // 1. Agente firma action_hash (off-chain) con su keypair Ed25519
  const signature = nacl.sign.detached(actionHash, agentKeypair.secretKey);

  // 2. Instrucción Ed25519 pre-verify — Solana la valida nativamente
  const ed25519Ix = Ed25519Program.createInstructionWithPublicKey({
    publicKey: agentKeypair.publicKey.toBytes(),
    message: actionHash,
    signature,
  });

  // 3. Instrucción record_attestations vía Anchor
  const methods = program.methods as unknown as Record<
    string,
    (...args: unknown[]) => {
      accounts: (a: Record<string, unknown>) => { instruction: () => Promise<unknown> };
    }
  >;
  const recordIx = (await methods
    .recordAttestations!([
      {
        actionType: actionTypeToVariant(actionType),
        actionHash: Array.from(actionHash),
        privacyMode,
        signature: Array.from(signature),
      },
    ])
    .accounts({
      operator,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    })
    .instruction()) as Awaited<ReturnType<Transaction['add']>>['instructions'][number];

  // 4. Tx con Ed25519 en índice 0 y record_attestations en índice 1
  const tx = new Transaction().add(ed25519Ix).add(recordIx as never);

  const provider = program.provider as AnchorProvider;
  const txSignature = await provider.sendAndConfirm!(tx, [], { commitment: 'confirmed' });
  return { txSignature };
}
