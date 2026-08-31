import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Flats & Apartments', slug: 'flats' },
  { name: 'PG & Hostels', slug: 'pg-hostel' },
  { name: 'Hourly Hotels', slug: 'hourly-hotels' },
  { name: 'Mess & Tiffin', slug: 'mess-tiffin' },
  { name: 'Plumber', slug: 'plumber' },
  { name: 'Electrician', slug: 'electrician' },
  { name: 'Maid / Helper', slug: 'maid' },
  { name: 'Pest Control', slug: 'pest-control' },
  { name: 'Gas Cylinder Delivery', slug: 'gas-delivery' },
  { name: 'Water Tanker', slug: 'water-supply' },
  { name: 'Other Services', slug: 'other-service' },
];

async function main() {
  console.log('Starting category seed...');
  
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
    console.log(`✅ Upserted category: ${cat.name}`);
  }
  
  console.log('🎉 Category seed complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
