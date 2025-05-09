import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function resetDatabase() {
  // Delete all records from all tables
  const tables = [
    'Interview',
    'Application',
    'InterviewStep',
    'InterviewType',
    'InterviewFlow',
    'Position',
    'Employee',
    'Company',
    'Resume',
    'WorkExperience',
    'Education',
    'Candidate'
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
}

export async function seedTestData() {
  // Import and run the seed function
  const { main } = require('../../prisma/seed');
  await main();
}

export { prisma };
