#!/bin/sh
set -e

echo "Ensuring oasdiff binary permissions..."
if [ -f "./bin/oasdiff-linux" ]; then
  chmod +x ./bin/oasdiff-linux
fi

echo "Applying database migrations..."
./node_modules/.bin/drizzle-kit migrate || npx drizzle-kit migrate || echo "Migration completed or skipped"

echo "Starting Clud server..."
if [ -f "dist/src/main.js" ]; then
  exec node dist/src/main.js
else
  exec node dist/main.js
fi
