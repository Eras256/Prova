import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiGet, apiPost, configFromEnv, toQuery, DEFAULT_API_URL } from './api.js';

const config = { apiUrl: 'https://api.test' };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('configFromEnv', () => {
  it('usa defaults cuando no hay env', () => {
    const c = configFromEnv({} as NodeJS.ProcessEnv);
    expect(c.apiUrl).toBe(DEFAULT_API_URL);
    expect(c.apiKey).toBeUndefined();
  });

  it('lee PROVA_API_URL y PROVA_API_KEY, quitando slash final', () => {
    const c = configFromEnv({
      PROVA_API_URL: 'https://custom.api/',
      PROVA_API_KEY: 'prova_abc',
    } as unknown as NodeJS.ProcessEnv);
    expect(c.apiUrl).toBe('https://custom.api');
    expect(c.apiKey).toBe('prova_abc');
  });

  it('trata una API key vacía como ausente', () => {
    const c = configFromEnv({ PROVA_API_KEY: '' } as unknown as NodeJS.ProcessEnv);
    expect(c.apiKey).toBeUndefined();
  });
});

describe('toQuery', () => {
  it('omite undefined y serializa el resto', () => {
    expect(toQuery({ a: '1', b: undefined, c: 2 })).toBe('?a=1&c=2');
  });

  it('devuelve cadena vacía sin params', () => {
    expect(toQuery({ a: undefined })).toBe('');
  });
});

describe('apiGet', () => {
  it('devuelve ok con el JSON del body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ data: 42 }), { status: 200 }))
    );
    const result = await apiGet<{ data: number }>(config, '/x');
    expect(result).toEqual({ ok: true, data: { data: 42 } });
  });

  it('extrae el mensaje de error de la API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error: { message: 'not found' } }), { status: 404 })
      )
    );
    const result = await apiGet(config, '/x');
    expect(result).toEqual({ ok: false, error: 'not found' });
  });

  it('cae a HTTP <status> si el body no es JSON', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('boom', { status: 500 })));
    const result = await apiGet(config, '/x');
    expect(result).toEqual({ ok: false, error: 'HTTP 500' });
  });

  it('captura errores de red como resultado, no excepción', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('ECONNREFUSED');
      })
    );
    const result = await apiGet(config, '/x');
    expect(result).toEqual({ ok: false, error: 'ECONNREFUSED' });
  });

  it('manda la API key en x-api-key cuando existe', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await apiGet({ apiUrl: 'https://api.test', apiKey: 'prova_k' }, '/x');
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>)['x-api-key']).toBe('prova_k');
  });
});

describe('apiPost', () => {
  it('envía el body como JSON', async () => {
    const fetchMock = vi.fn(async () => new Response('{"ok":true}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await apiPost(config, '/y', { ids: ['a'] });
    expect(result.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.test/y');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ ids: ['a'] }));
  });
});
