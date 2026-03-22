const { execSync } = require('child_process');

// Run Prisma db push first
try {
  execSync('npx prisma db push --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma --accept-data-loss --skip-generate', {
    stdio: 'inherit'
  });
} catch (e) {
  console.error('Prisma db push failed:', e.message);
  process.exit(1);
}

// Then start the NestJS app
require('./apps/backend/dist/apps/backend/src/main');