import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import * as Sentry from '@sentry/node';
import { ProvaError } from '@prova/core';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      { error: { code: 'HTTP_ERROR', message: err.message } },
      err.status
    );
  }

  // Comprobar si es un ProvaError por instance o por 'name' en caso de mismatch de modulo
  if (err instanceof ProvaError || (err as Error).name === 'ProvaError') {
    const code = (err as any).code;
    const message = (err as any).message;
    const statusMap: Record<string, number> = {
      AGENT_NOT_FOUND: 404,
      ATTESTATION_NOT_FOUND: 404,
      AGENT_REVOKED: 400,
      INVALID_SIGNATURE: 400,
      UNAUTHORIZED: 401,
      BATCH_LIMIT_EXCEEDED: 422,
    };

    const status = (statusMap[code] ?? 500) as 400 | 401 | 404 | 422 | 500;
    return c.json({ error: { code: code, message: message } }, status);
  }

  // Errores no esperados — reportar a Sentry y a stdout para diagnóstico.
  Sentry.captureException(err, { extra: { path: c.req.path, method: c.req.method } });
  console.error('Unhandled error:', err);
  return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, 500);
};
