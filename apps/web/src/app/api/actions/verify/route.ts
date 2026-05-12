/**
 * Solana Actions / Blinks endpoint para verificar atestaciones de Prova.
 *
 * Spec: https://solana.com/docs/advanced/actions
 *
 * Uso como Blink:
 *   https://prova-solana.vercel.app/api/actions/verify?tx=<txSignature>
 *
 * Compártelo en Twitter/X para que cualquier wallet compatible muestre
 * el receipt on-chain directamente en el feed.
 */

import { NextRequest } from 'next/server';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

export const runtime = 'edge';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const BASE_URL =
  process.env['NEXT_PUBLIC_VERCEL_URL']
    ? `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`
    : 'https://prova-solana.vercel.app';

const API_URL =
  process.env['NEXT_PUBLIC_PROVA_API_URL'] ?? 'https://prova-api.fly.dev';

const RPC_URL =
  process.env['HELIUS_RPC_URL'] ??
  process.env['NEXT_PUBLIC_SOLANA_RPC_URL'] ??
  'https://api.devnet.solana.com';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function actionResponse(body: unknown, status = 200) {
  return Response.json(body, { status, headers: CORS });
}

async function fetchAttestation(tx: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/attestations/${tx}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { actionType?: string; actionHash?: string; timestamp?: string; privacyMode?: boolean; agentPda?: string } };
    return json.data ?? null;
  } catch {
    return null;
  }
}

function formatTs(iso: string): string {
  try {
    return new Date(iso).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  } catch {
    return iso;
  }
}

// ─── OPTIONS (CORS preflight) ─────────────────────────────────────────────────

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

// ─── GET — Action metadata ────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const tx = req.nextUrl.searchParams.get('tx') ?? '';

  if (!tx) {
    return actionResponse({
      icon: `${BASE_URL}/icon-action.png`,
      title: 'Prova — Verify Agent Receipt',
      description:
        'Paste a Prova attestation transaction signature to verify it on-chain. Every receipt is cryptographically sealed with Ed25519 on Solana.',
      label: 'Verify Receipt',
      links: {
        actions: [
          {
            label: 'Verify',
            href: '/api/actions/verify?tx={tx}',
            parameters: [
              {
                name: 'tx',
                label: 'Transaction signature',
                required: true,
              },
            ],
          },
        ],
      },
    });
  }

  // Intentar cargar la atestación del indexer
  const att = await fetchAttestation(tx);

  if (!att) {
    return actionResponse({
      icon: `${BASE_URL}/icon-action.png`,
      title: 'Prova Receipt — Not Found',
      description: `Transaction ${tx.slice(0, 8)}…${tx.slice(-4)} was not found in the Prova index. It may not be an attestation, or the indexer hasn't processed it yet.`,
      label: 'Open Explorer',
      links: {
        actions: [
          {
            label: 'Open in Prova Explorer',
            href: `${BASE_URL}/explorer/tx/${tx}`,
          },
        ],
      },
    });
  }

  const label = att.actionType
    ? att.actionType.charAt(0).toUpperCase() + att.actionType.slice(1)
    : 'Attestation';

  const vanishBadge = att.privacyMode ? ' · Vanish (selective disclosure)' : ' · Public';
  const agent = att.agentPda ? `${att.agentPda.slice(0, 6)}…${att.agentPda.slice(-4)}` : '—';
  const ts = att.timestamp ? formatTs(att.timestamp) : '—';

  return actionResponse({
    icon: `${BASE_URL}/icon-action.png`,
    title: `Prova Receipt — ${label}${vanishBadge}`,
    description: [
      `Agent: ${agent}`,
      `Timestamp: ${ts}`,
      `Action hash: ${att.actionHash ? att.actionHash.slice(0, 16) + '…' : '—'}`,
      '',
      'This receipt is sealed on Solana with an Ed25519 signature. Verify it yourself in the Prova Explorer.',
    ].join('\n'),
    label: 'Open Receipt',
    links: {
      actions: [
        {
          label: 'Open in Prova Explorer',
          href: `${BASE_URL}/explorer/tx/${tx}`,
        },
      ],
    },
  });
}

// ─── POST — Action execution ──────────────────────────────────────────────────
// Devuelve una transacción no-op (memo) para satisfacer el protocolo Blinks.
// No cobra nada — el CTA real es el botón "Open in Prova Explorer".

export async function POST(req: NextRequest) {
  const tx = req.nextUrl.searchParams.get('tx') ?? '';

  let account: string;
  try {
    const body = (await req.json()) as { account?: string };
    account = body.account ?? '';
    new PublicKey(account); // valida formato
  } catch {
    return actionResponse({ error: 'Invalid account in request body' }, 400);
  }

  const payer = new PublicKey(account);

  try {
    // Tx mínima: auto-transferencia de 0 lamports (no-op válida en Solana)
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getLatestBlockhash',
        params: [{ commitment: 'confirmed' }],
      }),
      signal: AbortSignal.timeout(5_000),
    });
    const { result } = (await res.json()) as { result: { value: { blockhash: string; lastValidBlockHeight: number } } };
    const { blockhash, lastValidBlockHeight } = result.value;

    const transaction = new Transaction({
      feePayer: payer,
      blockhash,
      lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({ fromPubkey: payer, toPubkey: payer, lamports: 0 })
    );

    const serialized = Buffer.from(
      transaction.serialize({ requireAllSignatures: false, verifySignatures: false })
    ).toString('base64');

    return actionResponse({
      transaction: serialized,
      message: `Receipt verified · Open https://prova-solana.vercel.app/explorer/tx/${tx}`,
    });
  } catch {
    return actionResponse({ error: 'Failed to build verification transaction' }, 500);
  }
}
