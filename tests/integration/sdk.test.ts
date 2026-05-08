import { describe, it, expect } from 'vitest';
import { AttestationBuilder } from '@prova/sdk';
import { ProvaError, AgentNotFoundError, BatchLimitExceededError, AgentRevokedError, InvalidSignatureError, UnauthorizedError } from '@prova/core';
import { ActionTypeSchema } from '@prova/core';

describe('AttestationBuilder integration', () => {
  it('creates a transaction payload', () => {
    const p = AttestationBuilder.transaction('sig123', { amount: 100 });
    expect(p.actionType).toBe('Transaction');
    expect(p.payload['txSignature']).toBe('sig123');
    expect(p.payload['amount']).toBe(100);
  });

  it('creates a toolCall payload', () => {
    const p = AttestationBuilder.toolCall('web-search', { query: 'solana' });
    expect(p.actionType).toBe('ToolCall');
    expect(p.payload['toolName']).toBe('web-search');
  });

  it('creates a modelInvocation payload', () => {
    const p = AttestationBuilder.modelInvocation('claude-opus-4-7', 'hash123');
    expect(p.actionType).toBe('ModelInvocation');
    expect(p.payload['model']).toBe('claude-opus-4-7');
    expect(p.payload['promptHash']).toBe('hash123');
  });

  it('builder throws on missing actionType', () => {
    const { AttestationBuilder: AB } = await import('@prova/sdk');
    expect(() => new AB().setPayload({}).build()).toThrow('actionType is required');
  });

  it('builder throws on missing payload', () => {
    const { AttestationBuilder: AB } = await import('@prova/sdk');
    expect(() => new AB().setActionType('Transaction').build()).toThrow('payload is required');
  });
});

describe('Error hierarchy', () => {
  it('AgentNotFoundError is a ProvaError', () => {
    const err = new AgentNotFoundError('agent-1');
    expect(err).toBeInstanceOf(ProvaError);
    expect(err.code).toBe('AGENT_NOT_FOUND');
    expect(err.message).toContain('agent-1');
  });

  it('BatchLimitExceededError carries limit', () => {
    const err = new BatchLimitExceededError(10);
    expect(err.code).toBe('BATCH_LIMIT_EXCEEDED');
    expect(err.message).toContain('10');
  });

  it('AgentRevokedError', () => {
    const err = new AgentRevokedError('agent-2');
    expect(err.code).toBe('AGENT_REVOKED');
  });

  it('InvalidSignatureError', () => {
    const err = new InvalidSignatureError();
    expect(err.code).toBe('INVALID_SIGNATURE');
  });

  it('UnauthorizedError', () => {
    const err = new UnauthorizedError('issue_attestation');
    expect(err.code).toBe('UNAUTHORIZED');
  });
});

describe('ActionTypeSchema validation', () => {
  it('accepts all valid types', () => {
    const valid = ['Transaction', 'Decision', 'ModelInvocation', 'ToolCall', 'ResourceAccess', 'PolicyCheck', 'Custom'];
    valid.forEach((t) => expect(() => ActionTypeSchema.parse(t)).not.toThrow());
  });

  it('rejects invalid types', () => {
    expect(() => ActionTypeSchema.parse('Unknown')).toThrow();
    expect(() => ActionTypeSchema.parse('')).toThrow();
  });
});
