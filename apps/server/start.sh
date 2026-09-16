#!/bin/sh
set -e

echo "Ensuring oasdiff binary permissions..."
if [ -f "./bin/oasdiff-linux" ]; then
  chmod +x ./bin/oasdiff-linux
fi

echo "Pushing database schema updates if needed..."
pnpm db:push || echo "Schema push completed or skipped"

echo "Starting Clud server..."
exec node dist/main.js
