#!/bin/bash
set -e

echo "=== PRISMA DB PUSH ==="
npx prisma db push --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma --accept-data-loss --skip-generate

echo "=== STARTING NODE ==="
exec node apps/backend/dist/apps/backend/src/main.js 2>&1
