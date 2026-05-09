CREATE TABLE "agents" (
	"pda" text PRIMARY KEY NOT NULL,
	"operator" text NOT NULL,
	"agent_id" text NOT NULL,
	"policy_root" text NOT NULL,
	"registered_at" timestamp NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"attestation_count" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agents_agent_id_unique" UNIQUE("agent_id")
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" text NOT NULL,
	"scopes" text[] NOT NULL,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "attestations" (
	"pda" text PRIMARY KEY NOT NULL,
	"agent_pda" text NOT NULL,
	"action_type" text NOT NULL,
	"action_hash" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"block_height" bigint NOT NULL,
	"privacy_mode" boolean DEFAULT false NOT NULL,
	"metadata_uri" text,
	"metadata" jsonb,
	"signature" text NOT NULL,
	"schema_version" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"webhook_id" integer NOT NULL,
	"event" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status_code" integer,
	"response_body" text,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhooks" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"events" text[] NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attestations" ADD CONSTRAINT "attestations_agent_pda_agents_pda_fk" FOREIGN KEY ("agent_pda") REFERENCES "public"."agents"("pda") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_webhook_id_webhooks_id_fk" FOREIGN KEY ("webhook_id") REFERENCES "public"."webhooks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_agents_operator" ON "agents" USING btree ("operator");--> statement-breakpoint
CREATE INDEX "idx_agents_agent_id" ON "agents" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_agents_revoked" ON "agents" USING btree ("revoked");--> statement-breakpoint
CREATE INDEX "idx_api_keys_org" ON "api_keys" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_api_keys_hash" ON "api_keys" USING btree ("key_hash");--> statement-breakpoint
CREATE INDEX "idx_attestations_agent" ON "attestations" USING btree ("agent_pda");--> statement-breakpoint
CREATE INDEX "idx_attestations_type" ON "attestations" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "idx_attestations_timestamp" ON "attestations" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_attestations_block_height" ON "attestations" USING btree ("block_height");--> statement-breakpoint
CREATE INDEX "idx_attestations_hash" ON "attestations" USING btree ("action_hash");--> statement-breakpoint
CREATE INDEX "idx_deliveries_webhook" ON "webhook_deliveries" USING btree ("webhook_id");--> statement-breakpoint
CREATE INDEX "idx_webhooks_org" ON "webhooks" USING btree ("organization_id");