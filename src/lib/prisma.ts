import "dotenv/config";
import { PrismaClient } from "./../prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

let adapter: PrismaMariaDb | PrismaBetterSqlite3;
const databaseType = process.env.DATABASE_TYPE?.toLowerCase() || "sqlite";

if (databaseType === "mysql") {
    adapter = new PrismaMariaDb(process.env.DATABASE_URL || "mysql://root:password@localhost:3306/database?ssl=false");
} else if (databaseType === "sqlite") {
    adapter = new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL || "file:./dev.db",
    });
} else {
    adapter = new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL || "file:./dev.db",
    });
}

const prisma = new PrismaClient({ adapter });

export { prisma };

/*******  e46fcbb5-9ace-455b-9656-c0f3bf1b8e05  *******/
