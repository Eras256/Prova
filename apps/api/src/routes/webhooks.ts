/**
 * 🛡️ Prova Webhook Routes — Stub (Public Distribution)
 */
import { Hono } from 'hono';
const webhookRouter = new Hono();
webhookRouter.all('/*', (c) => c.json({ error: 'Not available in public distribution.' }, 403));
export { webhookRouter };
