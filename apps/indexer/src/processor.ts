/**
 * 🛡️ Prova Event Processor — Stub (Public Distribution)
 */
export class EventProcessor {
  constructor(private readonly db: unknown) {}
  async process(rawEvent: unknown): Promise<void> { console.log('[Processor] Restricted mode.'); }
}
