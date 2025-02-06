# use base nodejs (debian linux)
FROM node:22-alpine AS builder

# create folder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# build app
RUN npm run build

RUN npm ci --only=production

FROM node:22-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nestjs
RUN adduser -S nestjs -u 1001

ENV NODE_ENV=production

COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

USER nestjs

# run app
CMD ["sh", "-c", "npm run migration:run && node main.js"]