import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Para migraciones usar DATABASE_DIRECT_URL (conexión directa, no pooler)
    // El pooler de Supabase (pgBouncer) no soporta el modo Session que necesita Drizzle Kit
    url: process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
