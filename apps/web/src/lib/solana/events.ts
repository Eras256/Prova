import { BorshEventCoder, type Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from './idl.json';

const coder = new BorshEventCoder(idl as Idl);

export type ActionType =
  | 'transaction'
  | 'decision'
  | 'modelInvocation'
  | 'toolCall'
  | 'resourceAccess'
  | 'policyCheck'
  | 'custom';

export type AttestationIssued = {
  agent: PublicKey;
  agentId: Uint8Array;
  actionType: ActionType;
  actionHash: Uint8Array;
  privacyMode: boolean;
  timestamp: number;
  signature: Uint8Array;
};

export type DecodedEvent =
  | { name: 'AttestationIssued'; data: AttestationIssued }
  | { name: 'AgentRegistered'; data: { agent: PublicKey; operator: PublicKey; agentId: Uint8Array; timestamp: number } }
  | { name: 'AgentRevokedEvent'; data: { agent: PublicKey; operator: PublicKey; timestamp: number } }
  | { name: 'PolicyRootUpdated'; data: { agent: PublicKey; operator: PublicKey; newRoot: Uint8Array; timestamp: number } };

const PROGRAM_DATA_PREFIX = 'Program data: ';

// Anchor emite eventos como `Program data: <base64>` en los logs.
// Escaneamos cada línea, decodificamos a base64 y dejamos que Anchor parsee con el IDL.
export function decodeEventsFromLogs(logs: readonly string[]): DecodedEvent[] {
  const out: DecodedEvent[] = [];
  for (const log of logs) {
    if (!log.startsWith(PROGRAM_DATA_PREFIX)) continue;
    const b64 = log.slice(PROGRAM_DATA_PREFIX.length);
    try {
      const decoded = coder.decode(b64);
      if (!decoded) continue;
      out.push(normalize(decoded));
    } catch {
      // Otros eventos del programa (no Anchor) o líneas que no son eventos — saltar
    }
  }
  return out;
}

function normalize(raw: { name: string; data: Record<string, unknown> }): DecodedEvent {
  const ts = (v: unknown): number => {
    if (typeof v === 'number') return v;
    if (typeof v === 'bigint') return Number(v);
    if (v && typeof v === 'object' && 'toNumber' in v && typeof (v as { toNumber: () => number }).toNumber === 'function') {
      return (v as { toNumber: () => number }).toNumber();
    }
    return 0;
  };
  const bytes = (v: unknown): Uint8Array => (v instanceof Uint8Array ? v : new Uint8Array(v as ArrayLike<number>));

  switch (raw.name) {
    case 'AttestationIssued': {
      const d = raw.data as {
        agent: PublicKey;
        agentId: number[] | Uint8Array;
        actionType: Record<ActionType, Record<string, never>>;
        actionHash: number[] | Uint8Array;
        privacyMode: boolean;
        timestamp: unknown;
        signature: number[] | Uint8Array;
      };
      const actionType = (Object.keys(d.actionType)[0] ?? 'custom') as ActionType;
      return {
        name: 'AttestationIssued',
        data: {
          agent: d.agent,
          agentId: bytes(d.agentId),
          actionType,
          actionHash: bytes(d.actionHash),
          privacyMode: d.privacyMode,
          timestamp: ts(d.timestamp),
          signature: bytes(d.signature),
        },
      };
    }
    case 'AgentRegistered': {
      const d = raw.data as { agent: PublicKey; operator: PublicKey; agentId: number[] | Uint8Array; timestamp: unknown };
      return {
        name: 'AgentRegistered',
        data: { agent: d.agent, operator: d.operator, agentId: bytes(d.agentId), timestamp: ts(d.timestamp) },
      };
    }
    case 'AgentRevokedEvent': {
      const d = raw.data as { agent: PublicKey; operator: PublicKey; timestamp: unknown };
      return {
        name: 'AgentRevokedEvent',
        data: { agent: d.agent, operator: d.operator, timestamp: ts(d.timestamp) },
      };
    }
    case 'PolicyRootUpdated': {
      const d = raw.data as { agent: PublicKey; operator: PublicKey; newRoot: number[] | Uint8Array; timestamp: unknown };
      return {
        name: 'PolicyRootUpdated',
        data: { agent: d.agent, operator: d.operator, newRoot: bytes(d.newRoot), timestamp: ts(d.timestamp) },
      };
    }
    default:
      throw new Error(`Unknown event: ${raw.name}`);
  }
}

export function shortPubkey(pk: PublicKey | string, head = 4, tail = 4): string {
  const s = typeof pk === 'string' ? pk : pk.toBase58();
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

export function shortBytes(b: Uint8Array, head = 4, tail = 4): string {
  const hex = Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
  return `${hex.slice(0, head * 2)}…${hex.slice(-tail * 2)}`;
}

export const ACTION_TYPE_LABEL: Record<ActionType, string> = {
  transaction: 'Transaction',
  decision: 'Decision',
  modelInvocation: 'Model Invocation',
  toolCall: 'Tool Call',
  resourceAccess: 'Resource Access',
  policyCheck: 'Policy Check',
  custom: 'Custom',
};
