import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { attestationsRouter } from './routes/attestations';
import { agentsRouter } from './routes/agents';
import { premiumRouter } from './routes/premium';
import { webhooksRouter } from './routes/webhooks';
import { healthRouter } from './routes/health';
import { adminRouter } from './routes/admin';
import { errorHandler } from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limiter';

export const app = new Hono();

const ALLOWED_ORIGINS = [
  'https://prova.io',
  'https://www.prova.io',
  'https://prova-solana.vercel.app',
  // Previews de Vercel (patrón glob no soportado por Hono — usamos función)
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

app.use('*', cors({
  origin: (origin) => {
    if (!origin) return origin;
    if (ALLOWED_ORIGINS.includes(origin)) return origin;
    // Permite previews de Vercel: prova-solana-*.vercel.app
    if (/^https:\/\/prova-solana-[^.]+\.vercel\.app$/.test(origin)) return origin;
    return null;
  },
  credentials: true,
}));
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('/api/*', rateLimiter());

app.onError(errorHandler);

app.route('/api/v1/health', healthRouter);
app.route('/api/v1/attestations', attestationsRouter);
app.route('/api/v1/agents', agentsRouter);
app.route('/api/v1/premium', premiumRouter);
app.route('/api/v1/webhooks', webhooksRouter);
app.route('/api/v1/admin', adminRouter);

app.get('/', (c) => c.json({ name: 'Prova API', version: '1.0.0', status: 'ok' }));
