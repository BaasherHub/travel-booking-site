#!/bin/sh
set -e
echo "Running database migrations..."
npx prisma db push --skip-generate 2>&1 || echo "Warning: Database migration failed, app will start anyway"
echo "Starting application..."
node server.js
