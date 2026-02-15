FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma Client for the correct platform
RUN npx prisma generate

# Copy source code
COPY src ./src

EXPOSE 5000

# Run migrations and start
CMD npx prisma migrate deploy && node src/server.js