/**
 * 🛡️ Prova Database Queries — Stub (Public Distribution)
 *
 * La capa de datos real es propietaria. Estos stubs mantienen las mismas
 * firmas que las funciones reales para que el showroom compile.
 */
export async function getStats(db: unknown) { return { agents: 0, attestations: 0 }; }
export async function getIndexerCursor(db: unknown, programId: string) { return null; }
export async function setIndexerCursor(db: unknown, programId: string, lastSignature: string, lastSlot: number) {}

export async function getAgentByAgentId(
  db: unknown,
  agentId: string
): Promise<{ pda: string; [key: string]: unknown } | null> {
  return null;
}

export async function getAttestationByPda(
  db: unknown,
  pda: string
): Promise<Record<string, unknown> | null> {
  return null;
}

export async function listAttestations(
  db: unknown,
  options: {
    agentPda?: string;
    actionType?: string;
    fromTimestamp?: Date;
    toTimestamp?: Date;
    limit: number;
    offset: number;
  }
): Promise<{ data: unknown[]; total: number }> {
  return { data: [], total: 0 };
}

export async function getAgentStats(
  db: unknown,
  agentPda: string
): Promise<Record<string, unknown> | null> {
  return null;
}

export async function getGlobalStats(
  db: unknown
): Promise<{ agents: number; attestations: number }> {
  return { agents: 0, attestations: 0 };
}
