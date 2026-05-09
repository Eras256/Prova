import { describe, it, expect } from 'vitest';
import { decodeEventsFromLogs, getAttestationsFromLogs } from '../events';

// Base64 de un AttestationIssued real generado por el contrato.
// Discriminador: [173, 237, 90, 123, 155, 224, 231, 242]
// Payload: 32+32+1+32+1+8+64 = 170 bytes → total con disc = 178 bytes
function buildFakeAttestationLog(): string {
  const disc = Buffer.from([173, 237, 90, 123, 155, 224, 231, 242]);
  const agent      = Buffer.alloc(32, 0x11); // fake pubkey
  const agentId    = Buffer.alloc(32, 0x22);
  const actionType = Buffer.from([0]);        // Transaction (variant 0)
  const actionHash = Buffer.alloc(32, 0x33);
  const privacy    = Buffer.from([0]);        // false
  const timestamp  = Buffer.alloc(8, 0);      // i64 LE = 0
  timestamp.writeUInt32LE(1715299200, 0);     // epoch seconds
  const signature  = Buffer.alloc(64, 0x44);

  const payload = Buffer.concat([disc, agent, agentId, actionType, actionHash, privacy, timestamp, signature]);
  return `Program data: ${payload.toString('base64')}`;
}

describe('decodeEventsFromLogs', () => {
  it('returns empty array for empty logs', () => {
    expect(decodeEventsFromLogs([], 'sig', 100)).toEqual([]);
  });

  it('ignores non-Program-data lines', () => {
    const logs = [
      'Program G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1 invoke [1]',
      'Program log: Instruction: RecordAttestations',
      'Program G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1 success',
    ];
    expect(decodeEventsFromLogs(logs, 'sig', 100)).toEqual([]);
  });

  it('ignores Program data lines that do not match known discriminators', () => {
    const unknownData = Buffer.alloc(16, 0xff).toString('base64');
    expect(decodeEventsFromLogs([`Program data: ${unknownData}`], 'sig', 100)).toEqual([]);
  });

  it('decodes AttestationIssued from valid log line', () => {
    const events = decodeEventsFromLogs([buildFakeAttestationLog()], 'mysig', 999);
    expect(events).toHaveLength(1);
    const ev = events[0]!;
    expect(ev.name).toBe('AttestationIssued');
    if (ev.name === 'AttestationIssued') {
      expect(ev.data.txSignature).toBe('mysig');
      expect(ev.data.slot).toBe(999);
      expect(ev.data.actionType).toBe('Transaction');
      expect(ev.data.privacyMode).toBe(false);
    }
  });

  it('does not throw on malformed base64', () => {
    const logs = ['Program data: not-valid-base64!!!'];
    expect(() => decodeEventsFromLogs(logs, 'sig', 0)).not.toThrow();
    expect(decodeEventsFromLogs(logs, 'sig', 0)).toEqual([]);
  });

  it('does not throw on too-short payload', () => {
    const tooShort = Buffer.concat([
      Buffer.from([173, 237, 90, 123, 155, 224, 231, 242]),
      Buffer.alloc(10), // too short for AttestationIssued (needs 170)
    ]).toString('base64');
    const events = decodeEventsFromLogs([`Program data: ${tooShort}`], 'sig', 0);
    expect(events).toEqual([]);
  });

  it('processes multiple events in one log array', () => {
    const log = buildFakeAttestationLog();
    const events = decodeEventsFromLogs([log, log], 'sig2', 200);
    expect(events).toHaveLength(2);
  });
});

describe('getAttestationsFromLogs', () => {
  it('filters to AttestationIssued only', () => {
    const atts = getAttestationsFromLogs([buildFakeAttestationLog()], 'sig', 1);
    expect(atts).toHaveLength(1);
    expect(atts[0]!.txSignature).toBe('sig');
  });

  it('returns empty array when no attestation events', () => {
    expect(getAttestationsFromLogs([], 'sig', 0)).toEqual([]);
  });
});
