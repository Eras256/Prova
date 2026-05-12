import { NextRequest } from 'next/server';

// HELIUS_RPC_URL es server-only (sin prefijo NEXT_PUBLIC_).
// Esta route hace de proxy para que la API key nunca aparezca en el bundle del cliente.
const RPC_URL = process.env['HELIUS_RPC_URL'] ?? process.env['NEXT_PUBLIC_SOLANA_RPC_URL'] ?? '';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  if (!RPC_URL) {
    return Response.json({ jsonrpc: '2.0', id: null, error: { code: -32603, message: 'RPC not configured' } }, { status: 503 });
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
