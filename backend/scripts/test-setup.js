require('dotenv').config({ path: '.env.test' });
const { execSync } = require('child_process');

// Run Prisma commands with the test environment
execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
