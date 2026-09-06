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
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
WORKDIR /app/apps/api
RUN ./node_modules/.bin/prisma generate --schema prisma/schema.prisma
RUN corepack pnpm --filter @pcs/api build
# A imagem de runtime nao inclui fontes TypeScript. Compile o seed separadamente
# para que ele possa ser executado depois do deploy sem instalar dependencias.
RUN ./node_modules/.bin/tsc --outDir seed-dist --target ES2022 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck prisma/seed.ts
RUN corepack pnpm --filter @pcs/api deploy --prod /prod/api \
    && cd /prod/api \
    && ./node_modules/.bin/prisma generate --schema prisma/schema.prisma

FROM node:22-alpine AS runtime
WORKDIR /app/apps/api
ENV NODE_ENV=production
COPY --chown=node:node --from=build /prod/api/node_modules ./node_modules
COPY --chown=node:node --from=build /app/apps/api/package.json ./package.json
COPY --chown=node:node --from=build /app/apps/api/dist ./dist
COPY --chown=node:node --from=build /app/apps/api/seed-dist ./seed-dist
COPY --chown=node:node --from=build /app/apps/api/prisma ./prisma
COPY --chown=node:node --from=build /app/apps/api/prisma.config.ts ./prisma.config.ts
COPY --chown=node:node --from=build /app/apps/api/healthcheck.js ./healthcheck.js
COPY --chown=node:node --from=build /app/apps/api/docker-bootstrap.js ./docker-bootstrap.js
USER node
EXPOSE 3001
CMD ["sh", "-c", "node docker-bootstrap.js && node dist/main.js"]
