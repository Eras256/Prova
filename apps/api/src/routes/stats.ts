import { Hono } from 'hono';
import { getDb, getGlobalStats } from '@prova/db';

export const statsRouter = new Hono();

statsRouter.get('/', async (c) => {
  const db = getDb();
  const stats = await getGlobalStats(db);
  return c.json(stats);
});
