FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

# تثبيت المكتبات المخصصة للإنتاج فقط (أسرع وأصغر حجماً)
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]