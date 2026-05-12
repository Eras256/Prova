/**
 * Server-side route para crear API keys.
 * Gateado por Privy JWT — verifica que el usuario está autenticado antes de delegar
 * al endpoint /api/v1/admin/api-keys de la Hono API.
 *
 * POST /api/issue-key
 * Headers: Authorization: Bearer <privy-access-token>
 * Body: { name: string }
 */

import { NextRequest } from 'next/server';
import { createVerifier } from 'fast-jwt';

const ADMIN_API_URL =
  process.env['NEXT_PUBLIC_PROVA_API_URL'] ?? 'https://prova-api.fly.dev';

const ADMIN_SECRET = process.env['PROVA_ADMIN_SECRET'] ?? '';

const PRIVY_JWKS_ENDPOINT =
  process.env['NEXT_PUBLIC_PRIVY_JWKS_ENDPOINT'] ??
  `https://auth.privy.io/api/v1/apps/${process.env['NEXT_PUBLIC_PRIVY_APP_ID']}/jwks.json`;

// Cache de claves públicas de Privy
let cachedJwks: Record<string, string> = {};
let jwksCachedAt = 0;

async function getPrivyPublicKey(kid: string): Promise<string | null> {
  const now = Date.now();
  if (now - jwksCachedAt > 60 * 60 * 1000) {
    try {
      const res = await fetch(PRIVY_JWKS_ENDPOINT, { signal: AbortSignal.timeout(5_000) });
      const json = (await res.json()) as { keys?: Array<{ kid: string; x: string; crv: string }> };
      cachedJwks = {};
      for (const key of json.keys ?? []) {
        cachedJwks[key.kid] = JSON.stringify(key);
      }
      jwksCachedAt = now;
    } catch {
      // Usar cache antigua si el fetch falla
    }
  }
  return cachedJwks[kid] ?? null;
}

async function verifyPrivyToken(token: string): Promise<string | null> {
  try {
    // Decodifica el header sin verificar para obtener el kid
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const header = JSON.parse(Buffer.from(parts[0]!, 'base64url').toString()) as { kid?: string };
    if (!header.kid) return null;

    const jwk = await getPrivyPublicKey(header.kid);
    if (!jwk) return null;

    // Verificación con fast-jwt usando la clave pública ECDSA de Privy
    const verify = createVerifier({ key: jwk, algorithms: ['ES256'] });
    const payload = verify(token) as { sub?: string; app_id?: string };

    if (payload.app_id !== process.env['NEXT_PUBLIC_PRIVY_APP_ID']) return null;
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!ADMIN_SECRET) {
    return Response.json({ error: 'Key issuance not configured' }, { status: 503 });
  }

  // Autenticar al usuario via Privy JWT
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) {
    return Response.json({ error: 'Missing authorization token' }, { status: 401 });
  }

  const userId = await verifyPrivyToken(token);
  if (!userId) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Parse body
  let name = 'My API Key';
  try {
    const body = (await req.json()) as { name?: string };
    if (body.name && typeof body.name === 'string') {
      name = body.name.slice(0, 64).trim() || 'My API Key';
    }
  } catch {
    // usar nombre por defecto
  }

  // El orgId se deriva del userId de Privy para aislar keys por usuario
  const orgId = `user_${userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 40)}`;

  // Crear la key via el endpoint admin de la API
  const res = await fetch(`${ADMIN_API_URL}/api/v1/admin/api-keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': ADMIN_SECRET,
    },
    body: JSON.stringify({
      organizationId: orgId,
      name,
      scopes: ['read', 'write'],
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[issue-key] Admin API error:', err);
    return Response.json({ error: 'Failed to create API key' }, { status: 500 });
  }

  const json = await res.json();
  return Response.json(json);
}
