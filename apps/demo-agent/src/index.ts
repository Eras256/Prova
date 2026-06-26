import { createServer } from 'http';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { ProvaClient, PROVA_PROGRAM_ID } from 'prova-agent-sdk';
import { parseKeypair, deterministicKeypair } from './keypair';
import { buildRandomAction } from './actions';

// ─── Configuración por entorno ───────────────────────────────────────────────
const RPC_URL = process.env.RPC_URL ?? clusterApiUrl('devnet');
const PROGRAM_ID = process.env.PROGRAM_ID ?? PROVA_PROGRAM_ID;
const INTERVAL_MS = Number(process.env.INTERVAL_MS ?? 60_000);
const PORT = Number(process.env.PORT ?? 8080);
// Umbral por debajo del cual intentamos un airdrop de Devnet para seguir 24/7.
const MIN_BALANCE_SOL = Number(process.env.MIN_BALANCE_SOL ?? 0.2);
const AIRDROP_SOL = Number(process.env.AIRDROP_SOL ?? 1);

const operatorSecret = process.env.OPERATOR_SECRET_KEY;
if (!operatorSecret) {
  console.error('FATAL: falta OPERATOR_SECRET_KEY (keypair de Devnet con SOL).');
  process.exit(1);
}

const operatorKeypair = parseKeypair(operatorSecret);
// El agente firma action hashes off-chain; no necesita fondos. Identidad estable.
const agentKeypair = process.env.AGENT_SECRET_KEY
  ? parseKeypair(process.env.AGENT_SECRET_KEY)
  : deterministicKeypair('prova-demo-agent-v1');

const connection = new Connection(RPC_URL, { commitment: 'confirmed' });
const prova = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair, programId: PROGRAM_ID });
const [agentPda] = prova.deriveAgentPda(operatorKeypair.publicKey);

// ─── Estado para el health check ─────────────────────────────────────────────
const state = {
  status: 'starting' as 'starting' | 'ok' | 'degraded',
  operator: operatorKeypair.publicKey.toBase58(),
  agentPda: agentPda.toBase58(),
  attestationsSent: 0,
  lastAttestation: null as null | { type: string; label: string; sig: string; at: string },
  lastError: null as null | string,
  startedAt: new Date().toISOString(),
};

// ─── Utilidades ──────────────────────────────────────────────────────────────
async function ensureFunded(): Promise<void> {
  try {
    const lamports = await connection.getBalance(operatorKeypair.publicKey);
    const sol = lamports / LAMPORTS_PER_SOL;
    if (sol >= MIN_BALANCE_SOL) return;
    if (!RPC_URL.includes('devnet') && !RPC_URL.includes('localhost')) {
      console.warn(`Saldo bajo (${sol} SOL) pero no es Devnet: no se puede airdrop.`);
      return;
    }
    console.log(`Saldo bajo (${sol} SOL). Solicitando airdrop de ${AIRDROP_SOL} SOL...`);
    const sig = await connection.requestAirdrop(operatorKeypair.publicKey, AIRDROP_SOL * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig, 'confirmed');
    console.log('Airdrop confirmado.');
  } catch (err) {
    console.warn('Airdrop falló (rate limit de Devnet es común):', (err as Error).message);
  }
}

let registered = false;

async function ensureRegistered(): Promise<void> {
  if (registered) return;
  try {
    const account = await prova.getAgentAccount(operatorKeypair.publicKey);
    if (account.revoked) {
      throw new Error('El agente está revocado on-chain. Usa otro operador.');
    }
    // El programa verifica la firma Ed25519 contra el agent_id guardado en el PDA.
    // Si este operador ya estaba registrado con OTRA identidad de agente, firmar
    // con la nuestra produce InvalidSignature (6002). Detectarlo y avisar claro.
    const stored = Buffer.from(account.agentId);
    const mine = Buffer.from(agentKeypair.publicKey.toBytes());
    if (!stored.equals(mine)) {
      throw new Error(
        `agent_id on-chain != agente local. Este operador ya está registrado con ` +
          `otra identidad de agente. Usa un operador nuevo (sin registrar).`,
      );
    }
    registered = true;
    console.log(`Agente ya registrado. PDA=${state.agentPda}, atestaciones previas=${account.attestationCount}`);
  } catch (err) {
    const msg = (err as Error).message ?? '';
    if (msg.includes('revocado')) throw err;
    console.log('Agente no encontrado. Registrando...');
    await ensureFunded();
    const res = await prova.registerAgent({ operatorKeypair });
    registered = true;
    console.log(`Agente registrado. PDA=${res.agentPda.toBase58()} tx=${res.explorerUrl}`);
  }
}

async function emitOne(): Promise<void> {
  const action = buildRandomAction();
  const actionHash = await ProvaClient.hashAction(JSON.stringify(action.payload));
  const res = await prova.attest({
    operatorKeypair,
    actionHash,
    actionType: action.actionType,
  });
  state.attestationsSent += 1;
  state.lastAttestation = {
    type: action.actionType,
    label: action.label,
    sig: res.txSignature,
    at: new Date().toISOString(),
  };
  state.lastError = null;
  state.status = 'ok';
  console.log(`[${state.attestationsSent}] ${action.actionType} (${action.label}) -> ${res.explorerUrl}`);
}

// ─── Health server (requerido por el health check de Fly) ────────────────────
function startHealthServer(): void {
  const server = createServer((req, res) => {
    if (req.url === '/health') {
      const healthy = state.status !== 'degraded';
      res.writeHead(healthy ? 200 : 503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ service: 'prova-demo-agent', ...state }, null, 2));
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  server.listen(PORT, () => console.log(`Health check en puerto ${PORT}`));
}

// ─── Loop principal ──────────────────────────────────────────────────────────
let stopped = false;

async function tick(): Promise<void> {
  if (stopped) return;
  try {
    await ensureFunded();
    await ensureRegistered();
    await emitOne();
  } catch (err) {
    state.lastError = (err as Error).message;
    state.status = 'degraded';
    console.error('Error en tick:', state.lastError);
  }
}

async function main(): Promise<void> {
  console.log('prova-demo-agent arrancando...');
  console.log(`RPC=${RPC_URL} programId=${PROGRAM_ID} interval=${INTERVAL_MS}ms`);
  console.log(`operator=${state.operator}`);
  console.log(`agentId=${agentKeypair.publicKey.toBase58()} pda=${state.agentPda}`);

  startHealthServer();
  // El primer tick registra el agente si hace falta; si falla (faucet throttle,
  // sin fondos) no abortamos: el loop reintenta hasta que haya saldo.
  await tick();
  const timer = setInterval(tick, INTERVAL_MS);

  const shutdown = (signal: string) => {
    console.log(`Recibido ${signal}, apagando limpio...`);
    stopped = true;
    clearInterval(timer);
    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('FATAL en arranque:', err);
  process.exit(1);
});
