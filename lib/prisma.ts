import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// ==========================================
// 🔒 โค้ดเดิมสำหรับ MariaDB (คอมเมนต์เก็บไว้)
// ==========================================
/*
const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'root',
  password: 'Esp@as0ke',
  database: 'knowledge_db',
  port: 3306
});
*/
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;