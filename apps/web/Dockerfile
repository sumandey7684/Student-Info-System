FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --filter @sis/web... --no-frozen-lockfile

COPY . .
RUN pnpm --filter @sis/web build

EXPOSE 3000
CMD ["pnpm", "--filter", "@sis/web", "start"]
