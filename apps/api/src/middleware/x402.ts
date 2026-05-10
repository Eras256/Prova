/**
 * 🛡️ Prova x402 Payment Middleware — Stub (Public Distribution)
 */
import { Context, Next } from 'hono';
export const x402AgentPayment = () => {
  return async (c: Context, next: Next) => { await next(); };
};
