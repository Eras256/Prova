import { describe, expect, it } from 'vitest';
import { attachProva } from './attach';
import type { AttestationItem, HostAgent, ProvaAttester } from './types';

function fakeAttester(): ProvaAttester & { items: AttestationItem[] } {
  const items: AttestationItem[] = [];
  return {
    items,
    hashAction: async () => new Uint8Array(32),
    attest: async (item) => {
      items.push(item);
      return { txSignature: 'tx' };
    },
    batchAttest: async (batch) => {
      items.push(...batch);
      return { txSignature: 'tx' };
    },
  };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('attachProva', () => {
  it('runs the original action and attests its result', async () => {
    const attester = fakeAttester();
    const agent: HostAgent = {
      actions: [{ name: 'trade', handler: async () => ({ signature: 'sig123' }) }],
    };

    const handle = attachProva(agent, {
      attester,
      batch: { maxSize: 1, flushIntervalMs: 0 },
    });

    const result = await agent.actions[0]!.handler(agent, { amount: 10 });
    expect(result).toEqual({ signature: 'sig123' });

    await tick();
    await handle.flush();

    expect(attester.items).toHaveLength(1);
    expect(attester.items[0]!.actionType).toBe('Transaction');
  });

  it('never breaks the action when attestation fails', async () => {
    const attester: ProvaAttester = {
      hashAction: async () => {
        throw new Error('boom');
      },
      attest: async () => ({ txSignature: 'tx' }),
      batchAttest: async () => ({ txSignature: 'tx' }),
    };
    const agent: HostAgent = {
      actions: [{ name: 'x', handler: async () => ({ ok: true }) }],
    };

    attachProva(agent, { attester, onError: () => {} });

    const result = await agent.actions[0]!.handler(agent, {});
    expect(result).toEqual({ ok: true });
  });

  it('respects the rules filter', async () => {
    const attester = fakeAttester();
    const agent: HostAgent = {
      actions: [
        { name: 'trade', handler: async () => ({ signature: 's' }) },
        { name: 'fetchPrice', handler: async () => ({ price: 1 }) },
      ],
    };

    const handle = attachProva(agent, {
      attester,
      rules: (name) => name === 'trade',
      batch: { maxSize: 1, flushIntervalMs: 0 },
    });

    await agent.actions[0]!.handler(agent, {});
    await agent.actions[1]!.handler(agent, {});
    await tick();
    await handle.flush();

    expect(attester.items).toHaveLength(1);
  });
});
