import { describe, expect, it } from 'vitest';
import { buildPayload, extractSignature, mapActionType } from './payload';

describe('extractSignature', () => {
  it('reads the signature from common SAK result shapes', () => {
    expect(extractSignature({ signature: 'abc' })).toBe('abc');
    expect(extractSignature({ txSignature: 'def' })).toBe('def');
    expect(extractSignature({ txid: 'ghi' })).toBe('ghi');
  });

  it('returns undefined when there is no signature', () => {
    expect(extractSignature({ foo: 1 })).toBeUndefined();
    expect(extractSignature({ signature: '' })).toBeUndefined();
  });
});

describe('mapActionType', () => {
  it('classifies as Transaction when a signature is present', () => {
    expect(mapActionType('trade', { signature: 'x' })).toBe('Transaction');
  });

  it('classifies decision-like actions', () => {
    expect(mapActionType('rebalancePortfolio', {})).toBe('Decision');
    expect(mapActionType('exitPosition', {})).toBe('Decision');
  });

  it('falls back to ToolCall', () => {
    expect(mapActionType('fetchPrice', {})).toBe('ToolCall');
  });
});

describe('buildPayload', () => {
  it('builds a transaction payload when a signature is present', () => {
    const payload = buildPayload('trade', { amount: 1 }, { signature: 'sig' });
    expect(payload['kind']).toBe('transaction');
    expect(payload['signature']).toBe('sig');
  });

  it('builds a toolCall payload otherwise', () => {
    const payload = buildPayload('fetchPrice', { token: 'SOL' }, { price: 100 });
    expect(payload['kind']).toBe('toolCall');
  });
});
