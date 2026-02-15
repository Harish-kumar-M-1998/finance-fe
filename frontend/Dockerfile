FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

EXPOSE 5173

# Development command
CMD ["npm", "run", "dev", "--", "--host"]