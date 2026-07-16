// Cliente HTTP mínimo para la API REST pública de Prova. Sin dependencias:
// usa el fetch global de Node 18+. Los errores se devuelven como resultado
// discriminado, nunca como excepción hacia el caller.

export interface ApiConfig {
  /** Base URL de la API, sin slash final. */
  apiUrl: string;
  /** API key `prova_...` — solo necesaria para endpoints premium. */
  apiKey?: string;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export const DEFAULT_API_URL = 'https://prova-api.fly.dev';

export function configFromEnv(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  return {
    apiUrl: (env.PROVA_API_URL ?? DEFAULT_API_URL).replace(/\/$/, ''),
    apiKey: env.PROVA_API_KEY || undefined,
  };
}

function headers(config: ApiConfig): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(config.apiKey ? { 'x-api-key': config.apiKey } : {}),
  };
}

async function parseError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
  return body.error?.message ?? `HTTP ${res.status}`;
}

export async function apiGet<T>(config: ApiConfig, path: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${config.apiUrl}${path}`, { headers: headers(config) });
    if (!res.ok) return { ok: false, error: await parseError(res) };
    return { ok: true, data: (await res.json()) as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network error' };
  }
}

export async function apiPost<T>(
  config: ApiConfig,
  path: string,
  body: unknown
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${config.apiUrl}${path}`, {
      method: 'POST',
      headers: headers(config),
      body: JSON.stringify(body),
    });
    if (!res.ok) return { ok: false, error: await parseError(res) };
    return { ok: true, data: (await res.json()) as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network error' };
  }
}

/** Serializa query params omitiendo undefined. */
export function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
