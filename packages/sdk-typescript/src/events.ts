import { PublicKey } from '@solana/web3.js';
import type { ActionType } from '@prova/core';
import type { AttestationRecord } from './types';

// Discriminadores SHA-256("event:<Name>")[0..8] — calculados al momento de compilar el contrato.
// Verificados contra: hashlib.sha256("event:AttestationIssued".encode()).digest()[:8]
const DISC_ATTESTATION_ISSUED = Buffer.from([173, 237,  90, 123, 155, 224, 231, 242]);
const DISC_AGENT_REGISTERED   = Buffer.from([191,  78, 217,  54, 232, 100, 189,  85]);
const DISC_AGENT_REVOKED      = Buffer.from([218, 156, 242, 182,  58,  95, 202, 161]);

const ACTION_TYPE_VARIANTS: ActionType[] = [
  'Transaction', 'Decision', 'ModelInvocation',
  'ToolCall', 'ResourceAccess', 'PolicyCheck', 'Custom',
];

function matchDisc(buf: Buffer, expected: Buffer): boolean {
  return buf.slice(0, 8).equals(expected);
}

function readI64LE(buf: Buffer, offset: number): number {
  const lo = buf.readUInt32LE(offset);
  const hi = buf.readInt32LE(offset + 4);
  return hi * 0x100000000 + lo;
}

export interface AgentRegisteredEvent {
  name: 'AgentRegistered';
  agent: PublicKey;
  operator: PublicKey;
  agentId: Uint8Array;
  timestamp: number;
}

export interface AgentRevokedEvent {
  name: 'AgentRevoked';
  agent: PublicKey;
  operator: PublicKey;
  timestamp: number;
}

export type DecodedProvaEvent =
  | { name: 'AttestationIssued'; data: AttestationRecord }
  | { name: 'AgentRegistered'; data: AgentRegisteredEvent }
  | { name: 'AgentRevoked'; data: AgentRevokedEvent };

const PROGRAM_DATA_PREFIX = 'Program data: ';

/**
 * Decodifica eventos Prova de los logs de una transacción Solana.
 * Anchor emite eventos como `Program data: <base64>` en los logs.
 */
export function decodeEventsFromLogs(
  logs: string[],
  txSignature: string,
  slot: number
): DecodedProvaEvent[] {
  const out: DecodedProvaEvent[] = [];

  for (const log of logs) {
    if (!log.startsWith(PROGRAM_DATA_PREFIX)) continue;
    try {
      const buf = Buffer.from(log.slice(PROGRAM_DATA_PREFIX.length), 'base64');
      if (buf.length < 8) continue;
      const disc = buf.slice(0, 8);
      const p = buf.slice(8);

      if (matchDisc(disc, DISC_ATTESTATION_ISSUED) && p.length >= 170) {
        out.push({
          name: 'AttestationIssued',
          data: {
            txSignature,
            slot,
            agent:       new PublicKey(p.slice(0, 32)),
            agentId:     p.slice(32, 64),
            actionType:  ACTION_TYPE_VARIANTS[p[64] ?? 0] ?? 'Custom',
            actionHash:  p.slice(65, 97),
            privacyMode: p[97] !== 0,
            timestamp:   readI64LE(p, 98),
            signature:   p.slice(106, 170),
          },
        });
      } else if (matchDisc(disc, DISC_AGENT_REGISTERED) && p.length >= 104) {
        out.push({
          name: 'AgentRegistered',
          data: {
            name:      'AgentRegistered',
            agent:     new PublicKey(p.slice(0, 32)),
            operator:  new PublicKey(p.slice(32, 64)),
            agentId:   p.slice(64, 96),
            timestamp: readI64LE(p, 96),
          },
        });
      } else if (matchDisc(disc, DISC_AGENT_REVOKED) && p.length >= 72) {
        out.push({
          name: 'AgentRevoked',
          data: {
            name:      'AgentRevoked',
            agent:     new PublicKey(p.slice(0, 32)),
            operator:  new PublicKey(p.slice(32, 64)),
            timestamp: readI64LE(p, 64),
          },
        });
      }
    } catch {
      // Log no parseable — saltar
    }
  }

  return out;
}

/** Extrae solo los AttestationIssued de los logs de una tx. */
export function getAttestationsFromLogs(
  logs: string[],
  txSignature: string,
  slot: number
): AttestationRecord[] {
  return decodeEventsFromLogs(logs, txSignature, slot)
    .filter((e): e is { name: 'AttestationIssued'; data: AttestationRecord } =>
      e.name === 'AttestationIssued'
    )
    .map((e) => e.data);
}
