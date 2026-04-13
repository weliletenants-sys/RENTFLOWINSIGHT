# Stage 1: Build the application securely
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency configuration files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies using clean install for reproducible builds
RUN npm ci

# Generate Prisma Client specifically inside the Linux container context
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Compile TypeScript down to Javascript into dist/
RUN npm run build

# Stage 2: Production environment wrapper
FROM node:20-alpine AS runner

WORKDIR /app

# Ensure we're running fully in production mode to skip dev dependencies later
ENV NODE_ENV=production
# Google Cloud Run injects the PORT automatically, but we fall back to 8080 if running locally
ENV PORT=8080

# Copy verified artifacts from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Install production dependencies ONLY to minimize image footprint natively
RUN npm ci --only=production

# Generate Prisma Client explicitly again so the Production binary bindings lock correctly
RUN npx prisma generate

# Ensure the upload and log directories exist to prevent crashing on missing filesystem volumes
RUN mkdir -p uploads logs

EXPOSE 8080

# Cloud Run invokes CMD directly
CMD ["npm", "run", "start"]
