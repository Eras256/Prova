/**
 * 🛡️ Prova Indexer Service — Stub (Public Distribution)
 */
interface IndexerConfig { heliusApiKey?: string; rpcUrl?: string; programId: string; databaseUrl: string; }
export class IndexerService {
  constructor(private readonly config: IndexerConfig) {}
  async start(): Promise<void> { console.log('[Indexer] Running in restricted showroom mode.'); }
  stop(): void { console.log('[Indexer] Stopped.'); }
}
