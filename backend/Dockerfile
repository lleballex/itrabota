FROM node:20-bookworm-slim AS deps

WORKDIR /app

ENV YARN_NODE_LINKER=node-modules

COPY package.json yarn.lock ./

RUN corepack enable && yarn install --immutable

FROM node:20-bookworm-slim AS builder

WORKDIR /app

ENV YARN_NODE_LINKER=node-modules

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable && yarn build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 8000

CMD ["node", "dist/main.js"]
