# Debian slim (glibc): Next.js + Prisma + sharp optional deps are more reliable than Alpine/musl
# in CI. Alpine musl can make `npm ci` fail even with identical lockfile vs Windows.
FROM node:20-bookworm-slim AS base

FROM base AS deps
RUN apt-get update -y && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
# Schema needed for postinstall: prisma generate
COPY prisma ./prisma/
# Clear diagnostics when the lock is invalid; npm@10+ fails fast with a cryptic "Invalid" line otherwise.
SHELL ["/bin/bash", "-c"]
RUN if ! npm ci; then \
  echo ""; \
  echo "=== npm ci failed (EUSAGE) — usually means package.json, package-lock.json, or overrides disagreed at install time. ===" >&2; \
  echo "Local fix: rm -rf node_modules package-lock.json && npm install && npx npm@10.8.2 ci  # match Node 20 / npm 10" >&2; \
  echo "=== Top mismatched deps (npm explain): ===" >&2; \
  npm explain picomatch 2>&1 | head -60 || true; \
  echo "===" >&2; \
  exit 1; \
fi

FROM base AS builder
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd -r -g 1001 nodejs && useradd -r -u 1001 -g nodejs -d /app nextjs
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

COPY start.sh ./start.sh
RUN chmod +x start.sh
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["./start.sh"]
