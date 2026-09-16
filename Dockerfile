FROM node:20-alpine
RUN npm install -g pnpm

ENV CI=true

WORKDIR /usr/src/app

# Install native compatibility packages for Linux binaries and tini
RUN apk add --no-cache tini ca-certificates libc6-compat gcompat

# Copy workspace / root files if any
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Copy server package.json
COPY apps/server/package.json ./apps/server/package.json

# Install dependencies
RUN pnpm install --filter server...

# Copy server source code and binaries
COPY apps/server/ ./apps/server/

# Build the server
RUN pnpm --filter server run build

ENV NODE_ENV=production
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# Copy and configure startup script
COPY apps/server/start.sh ./apps/server/start.sh
RUN sed -i 's/\r$//' ./apps/server/start.sh && chmod +x ./apps/server/start.sh

# Ensure oasdiff binary is executable
RUN chmod +x ./apps/server/bin/oasdiff-linux 2>/dev/null || true

WORKDIR /usr/src/app/apps/server

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./start.sh"]
