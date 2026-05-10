/**
 * 🛡️ Prova Admin Routes — Stub (Public Distribution)
 */
import { Hono } from 'hono';
const adminRouter = new Hono();
adminRouter.post('/api-keys', (c) => c.json({ error: 'Not available in public distribution.' }, 403));
adminRouter.get('/api-keys/:orgId', (c) => c.json({ error: 'Not available in public distribution.' }, 403));
export { adminRouter };
