import { PrismaClient } from "@prisma/client";

// export const dbClient = new PrismaClient(
//     // {
//     // log: ['query', 'info', 'warn', 'error'],
//     // }
// );  

declare global {
    var dbClient: PrismaClient | undefined;
}

const dbClient = global.dbClient || new PrismaClient(      
    // {
    //      log: ['query', 'info', 'warn', 'error'],
    //      }
    );

if (process.env.NODE_ENV !== 'production') {
global.dbClient = dbClient;
}

export { dbClient };