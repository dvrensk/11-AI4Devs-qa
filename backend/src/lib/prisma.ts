import { PrismaClient } from '@prisma/client';

// Add global type declaration for the prisma client
declare global {
    var prisma: PrismaClient | undefined;
}

// Log environment and database info for debugging
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
if (process.env.DATABASE_URL) {
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL.replace(/\/\/.*@/, '//[CREDENTIALS_HIDDEN]@')}`);
}

// Prevent multiple instances of Prisma Client in development
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // In development/test, use a global variable to prevent multiple instances
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    prisma = global.prisma;
}

export default prisma;
