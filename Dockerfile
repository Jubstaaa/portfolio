# syntax=docker/dockerfile:1

# ─── deps ────────────────────────────────────────────────────────────────
# Alpine end to end: bun installs sharp's musl libvips (@img/*-linuxmusl-x64),
# which is the same flavour the node:alpine runner loads at request time.
# --ignore-scripts keeps husky's `prepare` from running (no .git in the build
# context); sharp 0.34 ships prebuilt binaries, so nothing here needs scripts.
FROM oven/bun:1-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

# ─── build ───────────────────────────────────────────────────────────────
# Turbopack (`next build`) — it traces standalone's runtime deps correctly.
# No build args: the canonical site URL lives in content/site.json, and the only
# secrets (Spotify) are read at request time by /api/now-playing.
FROM oven/bun:1-alpine AS build
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ─── runner ──────────────────────────────────────────────────────────────
# Next's standalone server on Node (not `bun run start`) — keeps idle RSS around
# 110MB instead of ~400MB, which matters on a shared 1GB droplet.
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# public/ carries the repo's images plus velite's generated _velite assets.
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Mount point for the persisted /_next/image cache (bind-mounted from the host).
RUN mkdir -p /app/.next/cache/images \
    && chown -R nextjs:nodejs /app/.next/cache

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
