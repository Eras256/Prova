/**
 * 🛡️ Prova Webhook Routes — Stub (Public Distribution)
 */
import { Hono } from 'hono';
const webhooksRouter = new Hono();
webhooksRouter.all('/*', (c) => c.json({ error: 'Not available in public distribution.' }, 403));
export { webhooksRouter };
