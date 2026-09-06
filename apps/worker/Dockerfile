FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/worker/package.json apps/worker/package.json
RUN corepack pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/worker/node_modules ./apps/worker/node_modules
COPY . .
RUN corepack pnpm --dir apps/worker build
RUN corepack pnpm --filter @pcs/worker deploy --prod /prod/worker

FROM node:22-alpine AS runtime
WORKDIR /app/apps/worker
ENV NODE_ENV=production
COPY --chown=node:node --from=build /prod/worker/node_modules ./node_modules
COPY --chown=node:node --from=build /app/apps/worker/package.json ./package.json
COPY --chown=node:node --from=build /app/apps/worker/dist ./dist
USER node
EXPOSE 3002
CMD ["node", "dist/main.js"]
