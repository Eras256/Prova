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
import { errorHandler } from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limiter';

export const app = new Hono();

app.use('*', cors({ origin: ['https://prova.io', 'http://localhost:3000'] }));
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

app.get('/', (c) => c.json({ name: 'Prova API', version: '1.0.0', status: 'ok' }));
