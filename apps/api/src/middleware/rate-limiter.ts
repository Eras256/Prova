/**
 * 🛡️ Prova Rate Limiter — Stub (Public Distribution)
 */
import { Context, Next } from 'hono';
export const rateLimiter = (opts?: { max?: number; windowMs?: number }) => {
  return async (c: Context, next: Next) => { await next(); };
};
