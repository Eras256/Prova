CREATE TABLE "indexer_state" (
	"program_id" text PRIMARY KEY NOT NULL,
	"last_signature" text,
	"last_slot" bigint,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
