# pgclerk.com — public marketing site (Next.js, port 3001).
#
# Multi-stage. Runtime image carries only the `output: 'standalone'`
# tree: `.next/standalone` plus `.next/static` (+ `public/` if present).
# next.config.mjs sets output:'standalone' so the build emits exactly
# that subset.

# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY tsconfig.json next.config.mjs postcss.config.mjs ./
COPY app ./app
COPY components ./components

# strict-dep-builds=false lets postinstall scripts (sharp, etc.) run
# under pnpm 11's stricter default.
ENV PNPM_CONFIG_STRICT_DEP_BUILDS=false

RUN pnpm install --frozen-lockfile
RUN pnpm run build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3001

# Nonroot user matching the chart's runAsUser=65532.
RUN addgroup -S -g 65532 nonroot && adduser -S -u 65532 -G nonroot nonroot

COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

USER 65532
EXPOSE 3001
CMD ["node", "server.js"]
