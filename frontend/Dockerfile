FROM node:20-bookworm-slim AS deps

WORKDIR /app

ENV YARN_NODE_LINKER=node-modules
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json yarn.lock ./

RUN corepack enable && yarn install --immutable

FROM node:20-bookworm-slim AS builder

WORKDIR /app

ENV YARN_NODE_LINKER=node-modules
ENV NEXT_TELEMETRY_DISABLED=1

ARG INTERNAL_API_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ATTACHMENT_HOST
ARG NEXT_PUBLIC_ATTACHMENT_URL

ENV INTERNAL_API_URL=${INTERNAL_API_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ATTACHMENT_HOST=${NEXT_PUBLIC_ATTACHMENT_HOST}
ENV NEXT_PUBLIC_ATTACHMENT_URL=${NEXT_PUBLIC_ATTACHMENT_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p public
RUN corepack enable && yarn next build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
