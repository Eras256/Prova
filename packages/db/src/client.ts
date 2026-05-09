import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb(databaseUrl?: string) {
  if (db) return db;

  const url = databaseUrl ?? process.env['DATABASE_URL'];
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Strip sslmode from URL — pg ignores our explicit ssl option otherwise
  const cleanUrl = url.replace(/[?&]sslmode=[^&]*/g, '').replace(/\?$/, '');
  const pool = new Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false },
  });
  db = drizzle(pool, { schema });
  return db;
}

export type Database = ReturnType<typeof getDb>;
