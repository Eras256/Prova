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
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN pnpm --filter=@prova/core build || true
RUN pnpm --filter=@prova/db build || true
RUN pnpm --filter=@prova/api build
RUN pnpm --filter=@prova/api deploy --prod /app/deploy

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/deploy/node_modules ./node_modules
COPY --from=builder /app/deploy/dist ./dist
COPY --from=builder /app/deploy/package.json ./package.json
EXPOSE 3001
CMD ["node", "dist/index.js"]
