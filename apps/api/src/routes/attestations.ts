import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getDb, getAttestationByPda, listAttestations } from '@prova/db';
import { AttestationNotFoundError } from '@prova/core';

export const attestationsRouter = new Hono();

const getAttestationSchema = z.object({
  id: z.string().min(32).max(44),
});

attestationsRouter.get('/:id', zValidator('param', getAttestationSchema), async (c) => {
  const { id } = c.req.valid('param');
  const db = getDb();

  const attestation = await getAttestationByPda(db, id);
  if (!attestation) {
    throw new AttestationNotFoundError(id);
  }

  return c.json({ data: attestation });
});

attestationsRouter.get('/', async (c) => {
  const rawLimit = parseInt(c.req.query('limit') ?? '20', 10);
  const rawOffset = parseInt(c.req.query('offset') ?? '0', 10);
  const agentPda = c.req.query('agentPda');
  const actionType = c.req.query('actionType');
  const from = c.req.query('from');
  const to = c.req.query('to');

  if (!Number.isFinite(rawLimit) || !Number.isFinite(rawOffset) || rawOffset < 0) {
    return c.json({ error: { code: 'INVALID_PARAM', message: 'Invalid limit or offset' } }, 400);
  }
  const limit = Math.min(Math.max(rawLimit, 1), 100);
  const offset = rawOffset;

  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;
  if (fromDate && isNaN(fromDate.getTime())) {
    return c.json({ error: { code: 'INVALID_PARAM', message: 'Invalid from date' } }, 400);
  }
  if (toDate && isNaN(toDate.getTime())) {
    return c.json({ error: { code: 'INVALID_PARAM', message: 'Invalid to date' } }, 400);
  }

  const db = getDb();
  const result = await listAttestations(db, {
    agentPda,
    actionType,
    fromTimestamp: fromDate,
    toTimestamp: toDate,
    limit,
    offset,
  });

  return c.json({ data: result.data, pagination: { limit, offset, total: result.total } });
});
