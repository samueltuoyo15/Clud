#!/bin/sh
set -e

echo "Ensuring oasdiff binary permissions..."
if [ -f "./bin/oasdiff-linux" ]; then
  chmod +x ./bin/oasdiff-linux
fi

echo "Applying database migrations..."
pnpm db:migrate || echo "Migration completed or skipped"

echo "Starting Clud server..."
exec node dist/main.js
