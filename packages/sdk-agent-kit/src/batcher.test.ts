import { describe, expect, it } from 'vitest';
import { createBatcher } from './batcher';
import type { AttestationItem, ProvaAttester } from './types';

function recordingAttester() {
  const attests: AttestationItem[] = [];
  const batches: AttestationItem[][] = [];
  const attester: ProvaAttester = {
    hashAction: async () => new Uint8Array(32),
    attest: async (item) => {
      attests.push(item);
      return { txSignature: 'tx' };
    },
    batchAttest: async (items) => {
      batches.push(items);
      return { txSignature: 'tx' };
    },
  };
  return { attester, attests, batches };
}

const item = (): AttestationItem => ({ actionHash: new Uint8Array(32), actionType: 'ToolCall' });
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('createBatcher — multi-tool-calling (bug del mentor)', () => {
  it('agrupa una RÁFAGA de 11 acciones en UNA sola batchAttest', async () => {
    const { attester, attests, batches } = recordingAttester();
    const batcher = createBatcher(attester, { maxSize: 25, flushDelayMs: 20 });

    for (let i = 0; i < 11; i++) batcher.add(item());

    await wait(50); // pasa el debounce
    expect(batches).toHaveLength(1); // UNA sola tx
    expect(batches[0]).toHaveLength(11); // con las 11 dentro
    expect(attests).toHaveLength(0); // ninguna suelta
  });

  it('no pierde nada si el agente cierra antes del debounce (stop hace flush)', async () => {
    const { attester, batches } = recordingAttester();
    const batcher = createBatcher(attester, { maxSize: 25, flushDelayMs: 5000 });

    for (let i = 0; i < 11; i++) batcher.add(item());
    await batcher.stop(); // cierre inmediato

    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(11);
  });

  it('hace flush inmediato al alcanzar maxSize', async () => {
    const { attester, batches } = recordingAttester();
    const batcher = createBatcher(attester, { maxSize: 5, flushDelayMs: 5000 });

    for (let i = 0; i < 5; i++) batcher.add(item());
    await wait(0);

    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(5);
  });

  it('una sola acción usa attest (no batchAttest)', async () => {
    const { attester, attests, batches } = recordingAttester();
    const batcher = createBatcher(attester, { flushDelayMs: 10 });

    batcher.add(item());
    await wait(30);

    expect(attests).toHaveLength(1);
    expect(batches).toHaveLength(0);
  });
});
