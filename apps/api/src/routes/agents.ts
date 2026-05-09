import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getDb, getAgentByAgentId, getAgentStats } from '@prova/db';
import { AgentNotFoundError } from '@prova/core';

export const agentsRouter = new Hono();

const agentIdSchema = z.object({
  agentId: z.string().min(1).max(100),
});

agentsRouter.get('/:agentId', zValidator('param', agentIdSchema), async (c) => {
  const { agentId } = c.req.valid('param');
  const db = getDb();

  const agent = await getAgentByAgentId(db, agentId);
  if (!agent) {
    throw new AgentNotFoundError(agentId);
  }

  return c.json({ data: agent });
});

agentsRouter.get('/:agentId/stats', zValidator('param', agentIdSchema), async (c) => {
  const { agentId } = c.req.valid('param');
  const db = getDb();

  const agent = await getAgentByAgentId(db, agentId);
  if (!agent) throw new AgentNotFoundError(agentId);

  const stats = await getAgentStats(db, agent.pda);
  return c.json({ data: stats });
});
