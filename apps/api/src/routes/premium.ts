/**
 * 🛡️ Prova Premium Routes — Stub (Public Distribution)
 */
import { Hono } from 'hono';
const premiumRouter = new Hono();
premiumRouter.all('/*', (c) => c.json({ error: 'Premium endpoints require full deployment.' }, 403));
export { premiumRouter };
