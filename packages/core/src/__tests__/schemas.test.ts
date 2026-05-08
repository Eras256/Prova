import { describe, it, expect } from 'vitest';
import { AttestationSchema, AgentSchema, ActionTypeSchema } from '../schemas';

describe('ActionTypeSchema', () => {
  it('accepts valid action types', () => {
    const types = ['Transaction', 'Decision', 'ModelInvocation', 'ToolCall', 'ResourceAccess', 'PolicyCheck', 'Custom'];
    types.forEach(t => {
      expect(() => ActionTypeSchema.parse(t)).not.toThrow();
    });
  });

  it('rejects invalid action types', () => {
    expect(() => ActionTypeSchema.parse('Invalid')).toThrow();
  });
});

describe('AgentSchema', () => {
  it('parses a valid agent', () => {
    const agent = {
      pda: 'pda123',
      operator: 'op456',
      agentId: 'agent789',
      policyRoot: 'root000',
      registeredAt: 1714000000,
      revoked: false,
      attestationCount: 42,
    };
    expect(() => AgentSchema.parse(agent)).not.toThrow();
  });
});

describe('AttestationSchema', () => {
  it('parses a valid attestation', () => {
    const attestation = {
      pda: 'att123',
      agentPda: 'agent456',
      actionType: 'Transaction',
      actionHash: 'hash789',
      timestamp: 1714000000,
      blockHeight: 300000000,
      privacyMode: false,
      metadataUri: null,
      metadata: null,
      signature: 'sig000',
      schemaVersion: 1,
    };
    expect(() => AttestationSchema.parse(attestation)).not.toThrow();
  });
});
