FROM node:20-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

# You can use these package managers
# yarn.lock* package-lock.json* pnpm-lock.yaml*

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN npm install --legacy-peer-deps --verbose

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG BACKEND_BASE_PATH
ENV BACKEND_BASE_PATH=${BACKEND_BASE_PATH}
ARG KEYCLOAK_URL
ENV KEYCLOAK_URL=${KEYCLOAK_URL}
ARG KEYCLOAK_CLIENT_ID
ENV KEYCLOAK_CLIENT_ID=${KEYCLOAK_CLIENT_ID}
ARG KEYCLOAK_REDIRECT_URI
ENV KEYCLOAK_REDIRECT_URI=${KEYCLOAK_REDIRECT_URI}
ARG KEYCLOAK_POST_LOGOUT_REDIRECT_URI
ENV KEYCLOAK_POST_LOGOUT_REDIRECT_URI=${KEYCLOAK_POST_LOGOUT_REDIRECT_URI}
ARG KEYCLOAK_PRES_REQ_CONF_ID
ENV KEYCLOAK_PRES_REQ_CONF_ID=${KEYCLOAK_PRES_REQ_CONF_ID}
ARG TEMPLATE_DIR
ENV TEMPLATE_DIR=${TEMPLATE_DIR}
ARG TEMPLATE_BRANCH
ENV TEMPLATE_BRANCH=${TEMPLATE_BRANCH}
ARG TEMPLATE_SCHEMA_DIR
ENV TEMPLATE_SCHEMA_DIR=${TEMPLATE_SCHEMA_DIR}

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]