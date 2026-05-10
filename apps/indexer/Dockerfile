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
RUN pnpm --filter=@prova/core build
RUN pnpm --filter=@prova/db build
RUN pnpm --filter=@prova/indexer build
RUN pnpm --filter=@prova/indexer deploy --prod /app/deploy

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/deploy/node_modules ./node_modules
COPY --from=builder /app/deploy/dist ./dist
COPY --from=builder /app/deploy/package.json ./package.json
EXPOSE 3002
CMD ["node", "dist/index.js"]
