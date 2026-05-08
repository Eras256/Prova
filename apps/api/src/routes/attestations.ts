import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getDb } from '@prova/db';
import { getAttestationByPda } from '@prova/db';
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
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 100);
  const offset = parseInt(c.req.query('offset') ?? '0', 10);

  return c.json({
    data: [],
    pagination: { limit, offset, total: 0 },
  });
});
