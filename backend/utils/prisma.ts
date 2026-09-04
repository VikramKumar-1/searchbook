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

  -- Auto-ensure booking columns exist in PostgreSQL
  ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "isReviewed" BOOLEAN DEFAULT false;
  ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "guestIdType" TEXT;
  ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "guestIdNumber" TEXT;
  ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "guestIdPhoto" TEXT;
  ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "stayPackage" TEXT;

  -- Auto-ensure listing columns exist in PostgreSQL
  ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER DEFAULT 0;
  ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "openingTime" TEXT DEFAULT '08:00 AM';
  ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "closingTime" TEXT DEFAULT '11:00 PM';
  ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "totalRooms" INTEGER DEFAULT 5;
  ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "customCategory" TEXT;
  ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "serviceRadiusKm" DOUBLE PRECISION;
  ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

  -- Auto-ensure reviews columns exist in PostgreSQL
  ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
  ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "guestName" TEXT;
  ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "bookingId" TEXT;
`).catch((err: unknown) => console.error('[DB Schema Migration Error]:', err instanceof Error ? err.message : err));

