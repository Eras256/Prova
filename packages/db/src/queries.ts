/**
 * 🛡️ Prova Database Queries — Stub (Public Distribution)
 */
export async function getStats(db: unknown) { return { agents: 0, attestations: 0 }; }
export async function getIndexerCursor(db: unknown, programId: string) { return null; }
export async function setIndexerCursor(db: unknown, programId: string, lastSignature: string, lastSlot: number) {}
