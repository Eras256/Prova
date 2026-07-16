// @ts-nocheck
import { getDb } from '../packages/db/src/client';
import { sql } from 'drizzle-orm';

async function run() {
  const prodDbUrl = 'postgresql://postgres.luqexlvyakxetjsrxhnn:Ether44.22.@aws-1-ca-central-1.pooler.supabase.com:6543/postgres';
  const db = getDb(prodDbUrl);
  console.log('Connecting to PRODUCTION database...');
  
  // Count
  const countRes = await db.execute(sql`SELECT count(*) FROM attestations`);
  console.log(`\nAttestations Count in PRODUCTION: ${countRes.rows[0].count}`);
  
  // Latest 5 rows
  const latest = await db.execute(sql`
    SELECT pda, agent_pda, action_type, timestamp 
    FROM attestations 
    ORDER BY timestamp DESC 
    LIMIT 5
  `);
  console.log('\n=== Latest 5 Attestations in PRODUCTION ===');
  console.log(latest.rows);
  
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
