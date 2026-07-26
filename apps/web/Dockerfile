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
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
WORKDIR /app/apps/web
RUN NEXT_BIN="$(find /app/node_modules -path '*/next/dist/bin/next' -print -quit)" && node "$NEXT_BIN" build

FROM base AS runtime
WORKDIR /app/apps/web
ENV NODE_ENV=production
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/apps/web/node_modules /app/apps/web/node_modules
COPY --from=build /app/apps/web/package.json ./package.json
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/next.config.mjs ./next.config.mjs
COPY --from=build /app/apps/web/healthcheck.js ./healthcheck.js
EXPOSE 3000
CMD ["sh", "-c", "NEXT_BIN=$(find /app/node_modules -path '*/next/dist/bin/next' -print -quit) && node \"$NEXT_BIN\" start --hostname 0.0.0.0"]
