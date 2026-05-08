import { describe, it, expect } from 'vitest';
import { AttestationBuilder } from '../attestation-builder';

describe('AttestationBuilder', () => {
  it('builds a valid attestation payload', () => {
    const payload = new AttestationBuilder()
      .setActionType('Transaction')
      .setPayload({ txSignature: 'abc123' })
      .build();

    expect(payload.actionType).toBe('Transaction');
    expect(payload.payload).toEqual({ txSignature: 'abc123' });
  });

  it('throws if actionType is missing', () => {
    expect(() => new AttestationBuilder().setPayload({}).build()).toThrow('actionType is required');
  });

  it('throws if payload is missing', () => {
    expect(() => new AttestationBuilder().setActionType('Transaction').build()).toThrow('payload is required');
  });

  it('static transaction() creates correct payload', () => {
    const payload = AttestationBuilder.transaction('sig123', { amount: 500 });
    expect(payload.actionType).toBe('Transaction');
    expect(payload.payload['txSignature']).toBe('sig123');
    expect(payload.payload['amount']).toBe(500);
  });

  it('static toolCall() creates correct payload', () => {
    const payload = AttestationBuilder.toolCall('search', { query: 'hello' });
    expect(payload.actionType).toBe('ToolCall');
    expect(payload.payload['toolName']).toBe('search');
  });

  it('static modelInvocation() creates correct payload', () => {
    const payload = AttestationBuilder.modelInvocation('gpt-4', 'hashxyz');
    expect(payload.actionType).toBe('ModelInvocation');
    expect(payload.payload['model']).toBe('gpt-4');
  });

  it('supports method chaining', () => {
    const builder = new AttestationBuilder();
    const result = builder.setActionType('Decision').setPayload({ choice: 'A' }).setMetadata({ context: 'test' });
    expect(result).toBe(builder);
    const payload = result.build();
    expect(payload.metadata).toEqual({ context: 'test' });
  });
});
