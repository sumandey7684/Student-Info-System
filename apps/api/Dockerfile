FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --filter @sis/api... --no-frozen-lockfile

COPY . .
RUN pnpm --filter @sis/api build

EXPOSE 4000
CMD ["pnpm", "--filter", "@sis/api", "start"]
