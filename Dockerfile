FROM node:20-alpine as deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV production

ENV NEXT_PUBLIC_BACKEND_BASE_PATH=APP_NEXT_PUBLIC_BACKEND_BASE_PATH
ENV NEXT_PUBLIC_KEYCLOAK_URL=APP_NEXT_PUBLIC_KEYCLOAK_URL
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=APP_NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ENV NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI=APP_NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI
ENV NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI=APP_NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI
ENV NEXT_PUBLIC_KEYCLOAK_PRES_REQ_CONF_ID=APP_NEXT_PUBLIC_KEYCLOAK_PRES_REQ_CONF_ID
ENV NEXT_PUBLIC_TEMPLATE_DIR=APP_NEXT_PUBLIC_TEMPLATE_DIR
ENV NEXT_PUBLIC_TEMPLATE_BRANCH=APP_NEXT_PUBLIC_TEMPLATE_BRANCH
ENV NEXT_PUBLIC_TEMPLATE_SCHEMA_DIR=APP_NEXT_PUBLIC_TEMPLATE_SCHEMA_DIR

RUN yarn build

FROM node:20-alpine as runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

RUN chmod +x /app/entrypoint.sh

# ENV NEXT_SHARP_PATH=/app/node_modules/sharp

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000
ENV PORT 3000

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["yarn", "start"]