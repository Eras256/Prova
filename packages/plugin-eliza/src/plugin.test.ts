import { describe, expect, it, vi } from 'vitest';
import type { ProvaAttester } from 'prova-agent-kit';
import { createProvaPlugin, provaPlugin } from './plugin';
import type { ElizaAction, ElizaRuntime } from './types';

function fakeAttester(): ProvaAttester & { attested: Array<{ actionType: string }> } {
  const attested: Array<{ actionType: string }> = [];
  return {
    attested,
    hashAction: vi.fn(async (payload: string) => {
      // hash determinista de 32 bytes para los tests
      const bytes = new Uint8Array(32);
      for (let i = 0; i < payload.length; i++) bytes[i % 32] ^= payload.charCodeAt(i);
      return bytes;
    }),
    attest: vi.fn(async (item) => {
      attested.push({ actionType: item.actionType });
      return { txSignature: 'sig-single' };
    }),
    batchAttest: vi.fn(async (items) => {
      for (const item of items) attested.push({ actionType: item.actionType });
      return { txSignature: 'sig-batch' };
    }),
  };
}

function fakeRuntime(actions: ElizaAction[]): ElizaRuntime {
  const runtime: ElizaRuntime = {
    actions,
    registerAction(action: ElizaAction) {
      runtime.actions.push(action);
    },
  };
  return runtime;
}

function action(name: string, result: unknown = { ok: true }): ElizaAction {
  return {
    name,
    similes: [`${name}_ALIAS`],
    handler: vi.fn(async () => result),
  };
}

const message = { content: { text: 'swap 100 USDC to SOL' } };

describe('createProvaPlugin', () => {
  it('devuelve un plugin con shape de elizaOS (name, description, init)', () => {
    const { plugin } = createProvaPlugin({ attester: fakeAttester() });
    expect(plugin.name).toBe('prova');
    expect(typeof plugin.description).toBe('string');
    expect(typeof plugin.init).toBe('function');
  });

  it('atesta la ejecución de una acción ya registrada', async () => {
    const attester = fakeAttester();
    const swap = action('EXECUTE_SWAP');
    const runtime = fakeRuntime([swap]);

    const { plugin, stop } = createProvaPlugin({ attester });
    await plugin.init!({}, runtime);

    const result = await runtime.actions[0].handler({}, message);
    expect(result).toEqual({ ok: true });
    await stop();

    expect(attester.hashAction).toHaveBeenCalledOnce();
    const payload = JSON.parse((attester.hashAction as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(payload.action).toBe('EXECUTE_SWAP');
    expect(payload.input).toEqual(message.content);
    expect(attester.attested.length).toBe(1);
  });

  it('preserva las demás propiedades de la acción al envolverla', async () => {
    const runtime = fakeRuntime([action('FOO')]);
    const { plugin } = createProvaPlugin({ attester: fakeAttester() });
    await plugin.init!({}, runtime);
    expect(runtime.actions[0].name).toBe('FOO');
    expect(runtime.actions[0].similes).toEqual(['FOO_ALIAS']);
  });

  it('también envuelve acciones registradas DESPUÉS de init', async () => {
    const attester = fakeAttester();
    const runtime = fakeRuntime([]);
    const { plugin, stop } = createProvaPlugin({ attester });
    await plugin.init!({}, runtime);

    runtime.registerAction!(action('LATE_TOOL'));
    await runtime.actions[0].handler({}, message);
    await stop();

    expect(attester.attested.length).toBe(1);
  });

  it('agrupa una ráfaga de acciones en un solo batch', async () => {
    const attester = fakeAttester();
    const runtime = fakeRuntime([action('A'), action('B'), action('C')]);
    const { plugin, stop } = createProvaPlugin({ attester });
    await plugin.init!({}, runtime);

    await Promise.all(runtime.actions.map((a) => a.handler({}, message)));
    await stop();

    expect(attester.attested.length).toBe(3);
    expect(attester.batchAttest).toHaveBeenCalled();
  });

  it('respeta rules: las acciones filtradas no se atestan ni se envuelven', async () => {
    const attester = fakeAttester();
    const skipped = action('INTERNAL_PING');
    const runtime = fakeRuntime([skipped]);
    const { plugin, stop } = createProvaPlugin({
      attester,
      rules: (name) => !name.startsWith('INTERNAL_'),
    });
    await plugin.init!({}, runtime);

    await runtime.actions[0].handler({}, message);
    await stop();

    expect(attester.hashAction).not.toHaveBeenCalled();
    expect(attester.attested.length).toBe(0);
  });

  it('un fallo de Prova jamás rompe la acción del agente', async () => {
    const attester = fakeAttester();
    (attester.hashAction as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('prova down'));
    const onError = vi.fn();
    const runtime = fakeRuntime([action('CRITICAL_TX', { done: true })]);
    const { plugin } = createProvaPlugin({ attester, onError });
    await plugin.init!({}, runtime);

    const result = await runtime.actions[0].handler({}, message);
    expect(result).toEqual({ done: true });

    // el error llega async al onError sin propagarse al caller
    await new Promise((r) => setTimeout(r, 10));
    expect(onError).toHaveBeenCalledWith(expect.any(Error), { action: 'CRITICAL_TX' });
  });

  it('coerciona resultados no-objeto (boolean/void) del handler de eliza', async () => {
    const attester = fakeAttester();
    const runtime = fakeRuntime([action('BOOL_ACTION', true)]);
    const { plugin, stop } = createProvaPlugin({ attester });
    await plugin.init!({}, runtime);

    await runtime.actions[0].handler({}, message);
    await stop();

    const payload = JSON.parse((attester.hashAction as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(payload.result).toEqual({ value: true });
  });
});

describe('provaPlugin (atajo)', () => {
  it('devuelve solo el plugin listo para el array plugins', () => {
    const plugin = provaPlugin({ attester: fakeAttester() });
    expect(plugin.name).toBe('prova');
    expect(typeof plugin.init).toBe('function');
  });
});
