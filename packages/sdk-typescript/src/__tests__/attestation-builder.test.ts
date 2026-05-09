import { describe, it, expect } from 'vitest';
import { AttestationBuilder } from '../attestation-builder';

describe('AttestationBuilder', () => {
  it('builds a valid payload with builder pattern', () => {
    const p = new AttestationBuilder()
      .setActionType('Transaction')
      .setPayload({ txSignature: 'abc123' })
      .build();
    expect(p.actionType).toBe('Transaction');
    expect(p.payload['txSignature']).toBe('abc123');
  });

  it('throws if actionType is missing', () => {
    expect(() => new AttestationBuilder().setPayload({}).build()).toThrow('actionType is required');
  });

  it('throws if payload is missing', () => {
    expect(() => new AttestationBuilder().setActionType('Transaction').build()).toThrow('payload is required');
  });

  it('supports method chaining (returns this)', () => {
    const builder = new AttestationBuilder();
    expect(builder.setActionType('Decision')).toBe(builder);
    expect(builder.setPayload({})).toBe(builder);
    expect(builder.setMetadata({})).toBe(builder);
  });

  it('includes metadata when set', () => {
    const p = new AttestationBuilder()
      .setActionType('Decision')
      .setPayload({ choice: 'A' })
      .setMetadata({ model: 'gpt-4', confidence: 0.95 })
      .build();
    expect(p.metadata?.['model']).toBe('gpt-4');
  });

  describe('factory methods', () => {
    it('transaction() sets correct action type and payload', () => {
      const p = AttestationBuilder.transaction('sig123', { amount: 500 });
      expect(p.actionType).toBe('Transaction');
      expect(p.payload['txSignature']).toBe('sig123');
      expect(p.payload['amount']).toBe(500);
    });

    it('toolCall() sets correct action type', () => {
      const p = AttestationBuilder.toolCall('web_search', { query: 'Solana price' });
      expect(p.actionType).toBe('ToolCall');
      expect(p.payload['toolName']).toBe('web_search');
      expect((p.payload['args'] as Record<string, string>)['query']).toBe('Solana price');
    });

    it('toolCall() defaults args to {}', () => {
      const p = AttestationBuilder.toolCall('ping');
      expect(p.payload['args']).toEqual({});
    });

    it('modelInvocation() sets model and promptHash', () => {
      const p = AttestationBuilder.modelInvocation('claude-opus-4-7', 'hashxyz');
      expect(p.actionType).toBe('ModelInvocation');
      expect(p.payload['model']).toBe('claude-opus-4-7');
      expect(p.payload['promptHash']).toBe('hashxyz');
    });

    it('decision() sets choice and rationale', () => {
      const p = AttestationBuilder.decision('approve', 'within policy bounds');
      expect(p.actionType).toBe('Decision');
      expect(p.payload['choice']).toBe('approve');
      expect(p.payload['rationale']).toBe('within policy bounds');
    });

    it('decision() handles missing rationale', () => {
      const p = AttestationBuilder.decision('reject');
      expect(p.payload['rationale']).toBeNull();
    });

    it('resourceAccess() sets resource and method', () => {
      const p = AttestationBuilder.resourceAccess('https://api.example.com/data', 'GET');
      expect(p.actionType).toBe('ResourceAccess');
      expect(p.payload['resource']).toBe('https://api.example.com/data');
      expect(p.payload['method']).toBe('GET');
    });

    it('policyCheck() sets policy and result', () => {
      const p = AttestationBuilder.policyCheck('kyc_required', 'pass');
      expect(p.actionType).toBe('PolicyCheck');
      expect(p.payload['result']).toBe('pass');
    });

    it('custom() sets custom action type', () => {
      const p = AttestationBuilder.custom({ event: 'anomaly_detected', severity: 'high' });
      expect(p.actionType).toBe('Custom');
      expect(p.payload['severity']).toBe('high');
    });
  });
});
