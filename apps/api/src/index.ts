import * as Sentry from '@sentry/node';

// Inicializar Sentry antes de importar la app — captura errores de arranque también.
const sentryDsn = process.env['SENTRY_DSN'];
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env['NODE_ENV'] ?? 'development',
    release: process.env['SENTRY_RELEASE'],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
  });
  console.log('Sentry initialized');
}

import { serve } from '@hono/node-server';
import { app } from './app';

const port = parseInt(process.env['PORT'] ?? '3001', 10);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Prova API running on port ${info.port}`);
  }
);
