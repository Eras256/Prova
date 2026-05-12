import { NextRequest } from 'next/server';

// HELIUS_RPC_URL es server-only (sin prefijo NEXT_PUBLIC_).
// Esta route hace de proxy para que la API key nunca aparezca en el bundle del cliente.
const RPC_URL = process.env['HELIUS_RPC_URL'] ?? process.env['NEXT_PUBLIC_SOLANA_RPC_URL'] ?? '';

export const runtime = 'edge';

// Simple per-IP rate limiting using a Map (resets on each cold start, which is fine for edge)
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 10_000; // 10 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  if (!RPC_URL) {
    return Response.json({ jsonrpc: '2.0', id: null, error: { code: -32603, message: 'RPC not configured' } }, { status: 503 });
  }

  // Basic rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return Response.json(
      { jsonrpc: '2.0', id: null, error: { code: -32005, message: 'Rate limit exceeded. Please wait a moment.' } },
      { status: 429, headers: { 'Retry-After': '5' } }
    );
  }

  const body = await req.text();

  // Validación básica: solo acepta JSON-RPC válido para evitar uso como open proxy
  try {
    const parsed = JSON.parse(body) as { jsonrpc?: string };
    if (parsed.jsonrpc !== '2.0') throw new Error('not jsonrpc');
  } catch {
    return Response.json({ error: 'Invalid JSON-RPC request' }, { status: 400 });
  }

  const upstream = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'prova-web/1.0',
    },
    body,
  });

  const data = await upstream.arrayBuffer();
  return new Response(data, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
