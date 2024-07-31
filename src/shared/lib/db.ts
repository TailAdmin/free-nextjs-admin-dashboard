import { PrismaClient } from "@prisma/client";

export const dbClient = new PrismaClient(
    // {
    // log: ['query', 'info', 'warn', 'error'],
    // }
);