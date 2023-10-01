# Get NPM packages
FROM node:18.18.0-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

# Rebuild the source code only when needed
FROM node:18.18.0-alpine AS builder
ENV PWA=true
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
ENV STRIPE_ACCOUNT_ID=${STRIPE_ACCOUNT_ID}
ENV STRIPE_PUBLIC_KEY=pk_live_51LoPw1EoEUGL2Bgubxo5vTjGRx0ONP4JHo6A0zVJivv7ToiCBoRnKdmRoCIWFbikTTenBSQZ7xy8wmF0woyx4NBH00MykU8UsN
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
ENV ADMIN_TOKEN=${ADMIN_TOKEN}
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN yarn build

# Production image, copy all the files and run next
FROM node:18.18.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["next", "start"]
