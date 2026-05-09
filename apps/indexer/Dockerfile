FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/db/package.json ./packages/db/
COPY packages/config-typescript/package.json ./packages/config-typescript/
COPY apps/indexer/package.json ./apps/indexer/
RUN pnpm install --frozen-lockfile
COPY packages/ ./packages/
COPY apps/indexer/ ./apps/indexer/
RUN pnpm --filter=@prova/db build || true
RUN pnpm --filter=@prova/core build || true
RUN pnpm --filter=@prova/indexer build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/indexer/dist ./apps/indexer/dist
COPY --from=builder /app/apps/indexer/package.json ./apps/indexer/package.json
EXPOSE 3002
CMD ["node", "apps/indexer/dist/index.js"]
