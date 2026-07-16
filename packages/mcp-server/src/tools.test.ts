import { afterEach, describe, expect, it, vi } from 'vitest';
import { sha256Hex, tools } from './tools.js';
import type { ApiConfig } from './api.js';

const config: ApiConfig = { apiUrl: 'https://api.test' };
const premiumConfig: ApiConfig = { apiUrl: 'https://api.test', apiKey: 'prova_k' };

function tool(name: string) {
  const found = tools.find((t) => t.name === name);
  if (!found) throw new Error(`tool ${name} not found`);
  return found;
}

function stubFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('registro de tools', () => {
  it('expone las 9 tools con nombres únicos', () => {
    const names = tools.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual([
      'get_stats',
      'list_attestations',
      'get_attestation',
      'get_agent',
      'get_agent_stats',
      'verify_action_hash',
      'get_full_history',
      'get_forensic_report',
      'bulk_verify',
    ]);
  });
});

describe('sha256Hex', () => {
  it('coincide con el vector conocido de "abc"', () => {
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });
});

describe('tools públicas', () => {
  it('get_stats pega a /api/v1/stats', async () => {
    const fetchMock = stubFetch({ agents: 1 });
    const result = await tool('get_stats').handler({}, config);
    expect(result.ok).toBe(true);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/api/v1/stats');
  });

  it('list_attestations serializa los filtros como query', async () => {
    const fetchMock = stubFetch({ data: [] });
    await tool('list_attestations').handler(
      { agentPda: 'AgPda', actionType: 'ToolCall', limit: 5 },
      config
    );
    const url = fetchMock.mock.calls[0][0] as unknown as string;
    expect(url).toBe('https://api.test/api/v1/attestations?agentPda=AgPda&actionType=ToolCall&limit=5');
  });

  it('get_attestation escapa el PDA en la URL', async () => {
    const fetchMock = stubFetch({ data: {} });
    await tool('get_attestation').handler({ pda: 'a/b' }, config);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/api/v1/attestations/a%2Fb');
  });

  it('propaga errores de la API como resultado isError', async () => {
    stubFetch({ error: { message: 'agent not found' } }, 404);
    const result = await tool('get_agent').handler({ agentId: 'x' }, config);
    expect(result.ok).toBe(false);
    expect(result.text).toContain('agent not found');
  });
});

describe('verify_action_hash', () => {
  it('devuelve solo el hash computado sin referencia', async () => {
    const result = await tool('verify_action_hash').handler({ payload: 'abc' }, config);
    expect(result.ok).toBe(true);
    expect(JSON.parse(result.text).computedHash).toBe(sha256Hex('abc'));
  });

  it('verifica match contra expectedHash (case/0x insensitive)', async () => {
    const result = await tool('verify_action_hash').handler(
      { payload: 'abc', expectedHash: `0x${sha256Hex('abc').toUpperCase()}` },
      config
    );
    expect(JSON.parse(result.text).match).toBe(true);
  });

  it('reporta mismatch cuando el payload no corresponde', async () => {
    const result = await tool('verify_action_hash').handler(
      { payload: 'otra cosa', expectedHash: sha256Hex('abc') },
      config
    );
    const parsed = JSON.parse(result.text);
    expect(parsed.match).toBe(false);
    expect(parsed.verdict).toContain('MISMATCH');
  });

  it('busca el actionHash on-chain cuando recibe attestationPda', async () => {
    const fetchMock = stubFetch({ data: { actionHash: sha256Hex('abc') } });
    const result = await tool('verify_action_hash').handler(
      { payload: 'abc', attestationPda: 'AttPda' },
      config
    );
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/api/v1/attestations/AttPda');
    expect(JSON.parse(result.text).match).toBe(true);
  });
});

describe('tools premium', () => {
  it('sin API key devuelven instrucción de configuración, sin llamar a la red', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    for (const name of ['get_full_history', 'get_forensic_report']) {
      const result = await tool(name).handler({ agentId: 'x' }, config);
      expect(result.ok).toBe(false);
      expect(result.text).toContain('PROVA_API_KEY');
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('con API key llegan al endpoint premium', async () => {
    const fetchMock = stubFetch({ data: [] });
    await tool('get_full_history').handler({ agentId: 'Ag' }, premiumConfig);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/api/v1/premium/full-history/Ag');
  });

  it('bulk_verify hace POST con los ids', async () => {
    const fetchMock = stubFetch({ data: [] });
    await tool('bulk_verify').handler({ ids: ['a', 'b'] }, premiumConfig);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.test/api/v1/premium/bulk-verify');
    expect(JSON.parse(init.body as string)).toEqual({ ids: ['a', 'b'] });
  });
});
