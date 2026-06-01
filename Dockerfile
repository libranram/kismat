# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer-cache friendly)
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
# Use a lightweight nginx image to serve the static output
FROM nginx:1.27-alpine AS runner

# Remove the default nginx config and replace with one suited for a SPA
# running on Cloud Run (port 8080, SPA fallback to index.html)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run expects the container to listen on $PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

# nginx runs in the foreground so Cloud Run can manage the process lifecycle
CMD ["nginx", "-g", "daemon off;"]
