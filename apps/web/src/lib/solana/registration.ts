import { Keypair, SystemProgram, type PublicKey } from '@solana/web3.js';
import { type Program } from '@coral-xyz/anchor';
import { deriveAgentPda } from './constants';

export type RegisterAgentResult = {
  txSignature: string;
  agentPda: PublicKey;
  agentKeypair: Keypair;
};

// Genera una keypair nueva para el agente (no es la wallet del operador).
// El secreto sólo existe en este navegador hasta que el usuario lo descargue.
export function generateAgentKeypair(): Keypair {
  return Keypair.generate();
}

export async function registerAgent(params: {
  program: Program;
  operator: PublicKey;
  agentKeypair: Keypair;
  policyRoot?: Uint8Array;
}): Promise<RegisterAgentResult> {
  const { program, operator, agentKeypair } = params;
  const policyRoot = params.policyRoot ?? new Uint8Array(32);
  if (policyRoot.length !== 32) throw new Error('policy_root must be exactly 32 bytes');

  const agentId = Array.from(agentKeypair.publicKey.toBytes());
  const policy = Array.from(policyRoot);

  // Anchor expone los métodos dinámicamente desde el IDL — Idl genérico no los tipea
  const methods = program.methods as unknown as Record<
    string,
    (...args: unknown[]) => {
      accounts: (a: Record<string, unknown>) => { rpc: (opts?: unknown) => Promise<string> };
    }
  >;
  const txSignature = await methods
    .registerAgent!(agentId, policy)
    .accounts({
      operator,
      systemProgram: SystemProgram.programId,
    })
    .rpc({ commitment: 'confirmed' });

  const [agentPda] = deriveAgentPda(operator);
  return { txSignature, agentPda, agentKeypair };
}

export async function revokeAgent(params: {
  program: Program;
  operator: PublicKey;
}): Promise<{ txSignature: string }> {
  const { program, operator } = params;
  const methods = program.methods as unknown as Record<
    string,
    () => {
      accounts: (a: Record<string, unknown>) => { rpc: (opts?: unknown) => Promise<string> };
    }
  >;
  const txSignature = await methods
    .revokeAgent!()
    .accounts({ operator })
    .rpc({ commitment: 'confirmed' });
  return { txSignature };
}

// Convierte errores de Anchor/Solana en mensajes legibles para el usuario.
export function parseProgramError(err: unknown): string {
  if (!err) return 'Unknown error';
  const e = err as { message?: string; logs?: string[]; error?: { errorMessage?: string } };

  // 1. Anchor error con código mapeado del IDL
  if (e.error?.errorMessage) return e.error.errorMessage;

  const message = e.message ?? String(err);

  // 2. PDA ya en uso → operador con agente previo
  if (/already in use/i.test(message)) {
    return 'An agent is already registered for this operator wallet. Connect a different wallet to register a new agent.';
  }

  // 3. Sin SOL para fees / rent
  if (/insufficient.*lamports|insufficient funds/i.test(message)) {
    return 'Operator wallet has insufficient SOL to pay rent + fees on devnet.';
  }

  // 4. Si hay logs, devuelve el primero útil
  const log = (e.logs ?? []).find((l) => /Program log:/.test(l) && !/Instruction:/.test(l));
  if (log) return log.replace(/^Program log:\s*/, '').trim();

  // 5. Limpia y trunca
  return message.length > 240 ? message.slice(0, 240) + '…' : message;
}

// Solana CLI compatible keypair JSON (array de 64 bytes).
export function keypairToJson(kp: Keypair): string {
  return JSON.stringify(Array.from(kp.secretKey));
}

export function downloadKeypair(kp: Keypair, filename: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([keypairToJson(kp)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
