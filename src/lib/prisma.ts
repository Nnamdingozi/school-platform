// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/client";

// const prismaClientSingleton = () => {
//   if (!process.env.DATABASE_URL) {
//     throw new Error("DATABASE_URL is missing in .env");
//   }

//   // 1. The "Key" (URL) goes into the Pool
//   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
//   // 2. The "Adapter" uses the Pool
//   const adapter = new PrismaPg(pool);

//   // 3. Prisma ONLY takes the adapter
//   // No 'datasourceUrl' or 'datasources' here!
//   return new PrismaClient({ adapter });
// };

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// export const prisma = globalThis.prisma ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;


// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/client";

// const prismaClientSingleton = () => {
//   if (!process.env.DATABASE_URL) {
//     throw new Error("DATABASE_URL is missing in your .env file");
//   }

//   // 1. Create the connection pool with the URL
//   const pool = new Pool({ 
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false } // Required for Supabase
//   });
  
//   // 2. Create the adapter with the pool
//   const adapter = new PrismaPg(pool);

//   // 3. Give the adapter to Prisma. NO other properties.
//   return new PrismaClient({ adapter });
// };

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// export const prisma = globalThis.prisma ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;


import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`


const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter })

export { prisma }