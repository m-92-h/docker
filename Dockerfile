# ###################################################################### هذا الكود انا كتبته لبيئة (next.js) ######################################################################################
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
# #######################################################################################################################################################################################

# ######################################################################### هذا الكود ماخوذ من كورسيرا (الصيغة العامة للملف) #########################################################################
# Use the official Node.js image as the base image
FROM node:14
# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json files
COPY package*.json ./
# Install dependencies
RUN npm install --production
# Copy the rest of the application code
COPY . .
# Add additional file
ADD public/index.html /app/public/index.html
# Expose the port on which the application will run
EXPOSE $PORT
# Specify the default command to run when the container starts
CMD ["node", "app.js"]
# Labeling the image
LABEL version="1.0"
LABEL description="Node.js application Docker image"
LABEL maintainer="Your Name"
# Healthcheck to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -fs http://localhost:$PORT || exit 1
# Set a non-root user for security purposes
USER node
# ######################################################################################################################################################################################
