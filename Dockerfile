# install dependencies
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# build app
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تفعيل وضع الإنتاج أثناء البناء
ENV NODE_ENV=production
RUN npm run build

# Runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# add non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات الضرورية فقط للتشغيل (تقليل الحجم)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]