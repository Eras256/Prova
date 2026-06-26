FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/sdk-typescript/package.json ./packages/sdk-typescript/
COPY packages/config-typescript/package.json ./packages/config-typescript/
COPY apps/demo-agent/package.json ./apps/demo-agent/
RUN pnpm install --frozen-lockfile
COPY packages/ ./packages/
COPY apps/demo-agent/ ./apps/demo-agent/
RUN pnpm --filter=@prova/core build
RUN pnpm --filter=prova-agent-sdk build
RUN pnpm --filter=@prova/demo-agent build
RUN pnpm --filter=@prova/demo-agent deploy --prod /app/deploy

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/deploy/node_modules ./node_modules
COPY --from=builder /app/deploy/dist ./dist
COPY --from=builder /app/deploy/package.json ./package.json
EXPOSE 8080
CMD ["node", "dist/index.js"]
