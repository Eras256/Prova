import { describe, it, expect } from 'vitest';
import { app } from '../app';

describe('GET /api/v1/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await app.request('/api/v1/health');
    expect(res.status).toBe(200);
    const body = await res.json() as { status: string };
    expect(body.status).toBe('ok');
  });
});

describe('GET /', () => {
  it('returns API info', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    const body = await res.json() as { name: string };
    expect(body.name).toBe('Prova API');
  });
});
