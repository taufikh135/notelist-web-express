import "dotenv/config";
import { PrismaClient } from "./../prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter: PrismaMariaDb = new PrismaMariaDb({
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    database: process.env.DATABASE_NAME as string,
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT as string),
    ssl: process.env.DATABASE_SSL === "true",
});

const prisma = new PrismaClient({ adapter });

export { prisma };
