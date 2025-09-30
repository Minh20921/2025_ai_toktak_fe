# syntax=docker/dockerfile:1
ARG NODE_VERSION=20-alpine
ARG BUILD_DIR=.next

# Dev dependencies (full)
FROM node:${NODE_VERSION} AS deps_dev
WORKDIR /app
COPY package*.json ./
# Prefer lockfile paths if present
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./
RUN set -eux; \
    corepack enable || true; \
    if [ -f pnpm-lock.yaml ]; then \
      corepack prepare pnpm@latest --activate || true; \
      pnpm install --frozen-lockfile || pnpm install; \
    elif [ -f yarn.lock ]; then \
      corepack prepare yarn@stable --activate || true; \
      yarn install --frozen-lockfile || yarn install; \
    elif [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund || npm i; \
    else \
      npm i; \
    fi

# Production dependencies only
FROM node:${NODE_VERSION} AS deps_prod
WORKDIR /app
COPY package*.json ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./
RUN set -eux; \
    corepack enable || true; \
    if [ -f pnpm-lock.yaml ]; then \
      corepack prepare pnpm@latest --activate || true; \
      pnpm install --frozen-lockfile --prod || pnpm install --prod; \
    elif [ -f yarn.lock ]; then \
      corepack prepare yarn@stable --activate || true; \
      yarn install --frozen-lockfile --production=true || yarn install --production=true; \
    elif [ -f package-lock.json ]; then \
      npm ci --omit=dev --no-audit --no-fund || npm i --omit=dev; \
    else \
      npm i --omit=dev; \
    fi

# Build application
FROM node:${NODE_VERSION} AS builder
ARG BUILD_DIR
ENV BUILD_DIR=${BUILD_DIR}
WORKDIR /app
COPY --from=deps_dev /app/node_modules ./node_modules
COPY . .
RUN npm run build || (echo "Build failed with npm run build" && exit 1)

# Development image
FROM node:${NODE_VERSION} AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
COPY --from=deps_dev /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["sh","-lc","node_modules/.bin/next dev -p ${PORT:-3000} -H 0.0.0.0"]

# Production image
FROM node:${NODE_VERSION} AS prod
ARG BUILD_DIR
ENV BUILD_DIR=${BUILD_DIR}
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Reuse production deps to avoid reinstalling
COPY --from=deps_prod /app/node_modules ./node_modules
COPY --from=builder /app/${BUILD_DIR} ./${BUILD_DIR}
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["sh","-lc","node_modules/.bin/next start -p ${PORT:-3000} -H 0.0.0.0"]
