import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProvaApiClient } from '../api-client';

const BASE_URL = 'https://api.prova.io';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

describe('ProvaApiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('strips trailing slash from apiUrl', () => {
      const client = new ProvaApiClient({ apiUrl: 'https://api.prova.io/' });
      expect(client).toBeInstanceOf(ProvaApiClient);
    });

    it('creates client without API key', () => {
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      expect(client).toBeInstanceOf(ProvaApiClient);
    });
  });

  describe('listAttestations()', () => {
    it('calls GET /api/v1/attestations with no params', async () => {
      const fetch = mockFetch(200, { data: [], pagination: { limit: 20, offset: 0, total: 0 } });
      vi.stubGlobal('fetch', fetch);
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      const result = await client.listAttestations();
      expect(result.data).toEqual([]);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/attestations`,
        expect.objectContaining({ headers: expect.any(Object) })
      );
    });

    it('passes query params as URLSearchParams', async () => {
      const fetch = mockFetch(200, { data: [], pagination: { limit: 10, offset: 5, total: 0 } });
      vi.stubGlobal('fetch', fetch);
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      await client.listAttestations({ agentPda: 'abc123', limit: 10, offset: 5 });
      const url = (fetch.mock.calls[0] as [string])[0];
      expect(url).toContain('agentPda=abc123');
      expect(url).toContain('limit=10');
      expect(url).toContain('offset=5');
    });

    it('throws on HTTP error', async () => {
      vi.stubGlobal('fetch', mockFetch(500, { error: { message: 'Server error' } }));
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      await expect(client.listAttestations()).rejects.toThrow('Server error');
    });
  });

  describe('getAttestation()', () => {
    it('returns attestation data', async () => {
      const att = { pda: 'abc', agentPda: 'def', actionType: 'Transaction' };
      vi.stubGlobal('fetch', mockFetch(200, { data: att }));
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      const result = await client.getAttestation('abc');
      expect(result.pda).toBe('abc');
    });

    it('encodes PDA in URL', async () => {
      const fetch = mockFetch(200, { data: {} });
      vi.stubGlobal('fetch', fetch);
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      await client.getAttestation('abc/def').catch(() => {});
      const url = (fetch.mock.calls[0] as [string])[0];
      expect(url).toContain('abc%2Fdef');
    });
  });

  describe('verifyAttestation()', () => {
    it('returns valid:true when attestation exists', async () => {
      const att = { pda: 'abc' };
      vi.stubGlobal('fetch', mockFetch(200, { data: att }));
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      const result = await client.verifyAttestation('abc');
      expect(result.valid).toBe(true);
      expect(result.attestation).toBeDefined();
    });

    it('returns valid:false when attestation not found', async () => {
      vi.stubGlobal('fetch', mockFetch(404, { error: { message: 'Not found' } }));
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      const result = await client.verifyAttestation('missing');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Not found');
    });
  });

  describe('getAgent()', () => {
    it('returns agent data', async () => {
      const agent = { pda: 'xyz', agentId: 'agent-1', revoked: false };
      vi.stubGlobal('fetch', mockFetch(200, { data: agent }));
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      const result = await client.getAgent('agent-1');
      expect(result.pda).toBe('xyz');
    });
  });

  describe('getAgentStats()', () => {
    it('returns stats data', async () => {
      const stats = { agent: { pda: 'xyz' }, totalAttestations: 5, byType: {}, recentAttestations: [] };
      vi.stubGlobal('fetch', mockFetch(200, { data: stats }));
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      const result = await client.getAgentStats('agent-1');
      expect(result.totalAttestations).toBe(5);
    });
  });

  describe('API key header', () => {
    it('sends x-api-key header when apiKey is provided', async () => {
      const fetch = mockFetch(200, { data: [], pagination: { limit: 20, offset: 0, total: 0 } });
      vi.stubGlobal('fetch', fetch);
      const client = new ProvaApiClient({ apiUrl: BASE_URL, apiKey: 'prova_test_key' });
      await client.listAttestations();
      const opts = (fetch.mock.calls[0] as [string, RequestInit])[1];
      expect((opts.headers as Record<string, string>)['x-api-key']).toBe('prova_test_key');
    });

    it('does not send x-api-key when no apiKey', async () => {
      const fetch = mockFetch(200, { data: [], pagination: { limit: 20, offset: 0, total: 0 } });
      vi.stubGlobal('fetch', fetch);
      const client = new ProvaApiClient({ apiUrl: BASE_URL });
      await client.listAttestations();
      const opts = (fetch.mock.calls[0] as [string, RequestInit])[1];
      expect((opts.headers as Record<string, string>)['x-api-key']).toBeUndefined();
    });
  });

  describe('bulkVerify()', () => {
    it('posts ids and returns results', async () => {
      const results = [{ id: 'a', valid: true, actionType: 'Transaction', timestamp: null, checkedAt: '' }];
      const fetch = mockFetch(200, { data: results });
      vi.stubGlobal('fetch', fetch);
      const client = new ProvaApiClient({ apiUrl: BASE_URL, apiKey: 'prova_key' });
      const out = await client.bulkVerify(['a']);
      expect(out[0]?.valid).toBe(true);
      const opts = (fetch.mock.calls[0] as [string, RequestInit])[1];
      expect(opts.method).toBe('POST');
      expect(opts.body).toBe(JSON.stringify({ ids: ['a'] }));
    });
  });
});
