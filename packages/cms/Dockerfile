# Get NPM packages
FROM node:14-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN yarn 

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app
COPY ./extensions/ .uploads/ ./
COPY --from=dependencies /app/node_modules ./node_modules

VOLUME [ "/app/extensions", "/app/uploads" ]
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S directus -u 1001

USER directus
EXPOSE ${PORT:-8055}

CMD ["yarn", "start"]