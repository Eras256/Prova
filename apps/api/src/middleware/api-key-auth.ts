/**
 * 🛡️ Prova API Key Auth — Stub (Public Distribution)
 */
import { Context, Next } from 'hono';
export const apiKeyAuth = () => {
  return async (c: Context, next: Next) => { await next(); };
};
