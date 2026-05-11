import { IndexerService } from './indexer';
import { HealthServer } from './health';

async function main() {
  const indexer = new IndexerService({
    heliusApiKey: process.env['HELIUS_API_KEY']!,
    programId: process.env['SOLANA_PROGRAM_ID'] ?? 'G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1',
    databaseUrl: process.env['DATABASE_URL']!,
  });

  const health = new HealthServer(3002);

  process.on('SIGINT', async () => {
    console.log('Shutting down indexer...');
    indexer.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down indexer...');
    indexer.stop();
    process.exit(0);
  });

  await health.start();
  await indexer.start();
}

main().catch((err) => {
  console.error('Fatal indexer error:', err);
  process.exit(1);
});
