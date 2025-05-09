// Load test environment
require('dotenv').config({ path: '.env.test' });
const { execSync } = require('child_process');

// Show which database URL we're using
console.log(`Test setup using DATABASE_URL: ${process.env.DATABASE_URL.replace(/\/\/.*@/, '//[CREDENTIALS_HIDDEN]@')}`);

// Run Prisma commands with the test environment
execSync('npx prisma migrate reset --force', { 
  stdio: 'inherit',
  env: {...process.env, DATABASE_URL: process.env.DATABASE_URL}
});
