import {
  pgTable,
  text,
  bigint,
  timestamp,
  boolean,
  jsonb,
  index,
  serial,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const agents = pgTable(
  'agents',
  {
    pda: text('pda').primaryKey(),
    operator: text('operator').notNull(),
    agentId: text('agent_id').notNull().unique(),
    policyRoot: text('policy_root').notNull(),
    registeredAt: timestamp('registered_at').notNull(),
    revoked: boolean('revoked').default(false).notNull(),
    attestationCount: bigint('attestation_count', { mode: 'number' }).default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    operatorIdx: index('idx_agents_operator').on(t.operator),
    agentIdIdx: index('idx_agents_agent_id').on(t.agentId),
    revokedIdx: index('idx_agents_revoked').on(t.revoked),
  })
);

export const attestations = pgTable(
  'attestations',
  {
    pda: text('pda').primaryKey(),
    agentPda: text('agent_pda')
      .notNull()
      .references(() => agents.pda),
    actionType: text('action_type').notNull(),
    actionHash: text('action_hash').notNull(),
    timestamp: timestamp('timestamp').notNull(),
    blockHeight: bigint('block_height', { mode: 'number' }).notNull(),
    privacyMode: boolean('privacy_mode').default(false).notNull(),
    metadataUri: text('metadata_uri'),
    metadata: jsonb('metadata'),
    signature: text('signature').notNull(),
    schemaVersion: bigint('schema_version', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    agentIdx: index('idx_attestations_agent').on(t.agentPda),
    typeIdx: index('idx_attestations_type').on(t.actionType),
    timestampIdx: index('idx_attestations_timestamp').on(t.timestamp),
    blockHeightIdx: index('idx_attestations_block_height').on(t.blockHeight),
    hashIdx: index('idx_attestations_hash').on(t.actionHash),
  })
);

export const webhooks = pgTable(
  'webhooks',
  {
    id: serial('id').primaryKey(),
    organizationId: text('organization_id').notNull(),
    url: text('url').notNull(),
    secret: text('secret').notNull(),
    events: text('events').array().notNull(),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    orgIdx: index('idx_webhooks_org').on(t.organizationId),
  })
);

export const apiKeys = pgTable(
  'api_keys',
  {
    id: serial('id').primaryKey(),
    organizationId: text('organization_id').notNull(),
    name: text('name').notNull(),
    keyHash: text('key_hash').notNull().unique(),
    keyPrefix: text('key_prefix').notNull(),
    scopes: text('scopes').array().notNull(),
    lastUsedAt: timestamp('last_used_at'),
    expiresAt: timestamp('expires_at'),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    orgIdx: index('idx_api_keys_org').on(t.organizationId),
    keyHashIdx: index('idx_api_keys_hash').on(t.keyHash),
  })
);

export const webhookDeliveries = pgTable(
  'webhook_deliveries',
  {
    id: serial('id').primaryKey(),
    webhookId: integer('webhook_id')
      .notNull()
      .references(() => webhooks.id),
    event: text('event').notNull(),
    payload: jsonb('payload').notNull(),
    statusCode: integer('status_code'),
    responseBody: text('response_body'),
    attemptCount: integer('attempt_count').default(0).notNull(),
    deliveredAt: timestamp('delivered_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    webhookIdx: index('idx_deliveries_webhook').on(t.webhookId),
  })
);

// Cursor del indexer — permite reanudar tras reinicio sin reindexar toda la historia.
export const indexerState = pgTable('indexer_state', {
  programId: text('program_id').primaryKey(),
  lastSignature: text('last_signature'),
  lastSlot: bigint('last_slot', { mode: 'number' }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const agentsRelations = relations(agents, ({ many }) => ({
  attestations: many(attestations),
}));

export const attestationsRelations = relations(attestations, ({ one }) => ({
  agent: one(agents, {
    fields: [attestations.agentPda],
    references: [agents.pda],
  }),
}));

export const webhooksRelations = relations(webhooks, ({ many }) => ({
  deliveries: many(webhookDeliveries),
}));

export const webhookDeliveriesRelations = relations(webhookDeliveries, ({ one }) => ({
  webhook: one(webhooks, {
    fields: [webhookDeliveries.webhookId],
    references: [webhooks.id],
  }),
}));
