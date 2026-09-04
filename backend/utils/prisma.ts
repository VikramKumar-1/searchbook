import 'server-only';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// In Prisma 7, we MUST use a Driver Adapter for connection
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Auto-ensure partner KYC columns exist in PostgreSQL
pool.query(`
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "businessName" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "businessType" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "govtIdType" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "govtIdNumber" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "govtIdPhoto" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "drivingLicenseNumber" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "drivingLicensePhoto" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "qualification" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "medicalRegNumber" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "certificatePhoto" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "clinicAddress" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "doesHomeVisit" BOOLEAN DEFAULT true;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subjectsOrSpeciality" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "kycStatus" TEXT DEFAULT 'PENDING';
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "kycNotes" TEXT;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "legalAgreed" BOOLEAN DEFAULT false;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "legalAgreedAt" TIMESTAMP(3);
`).catch((err: unknown) => console.error('[DB Schema Migration Error]:', err instanceof Error ? err.message : err));

