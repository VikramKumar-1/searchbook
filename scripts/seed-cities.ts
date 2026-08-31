import { config } from 'dotenv';
config(); // Load .env file

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Setup driver adapter for Prisma 7+
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const LOCATION_DATA = [
  {
    city: { name: 'New Delhi', slug: 'new-delhi' },
    localities: [
      { name: 'Lado Sarai', slug: 'lado-sarai', landmarks: ['Qutub Minar', 'Saket Metro'] },
      { name: 'Hauz Khas', slug: 'hauz-khas', landmarks: ['Hauz Khas Village', 'IIT Delhi'] },
      { name: 'Laxmi Nagar', slug: 'laxmi-nagar', landmarks: ['V3S Mall', 'Laxmi Nagar Metro'] }
    ]
  },
  {
    city: { name: 'Gurugram', slug: 'gurugram' },
    localities: [
      { name: 'DLF Phase 2', slug: 'dlf-phase-2', landmarks: ['DLF Cyber Hub', 'MG Road Metro'] },
      { name: 'Sector 14', slug: 'sector-14', landmarks: ['Sector 14 Market', 'Gurgaon Railway Station'] },
      { name: 'Golf Course Road', slug: 'golf-course-road', landmarks: ['Horizon Center'] }
    ]
  },
  {
    city: { name: 'Noida', slug: 'noida' },
    localities: [
      { name: 'Sector 18', slug: 'sector-18', landmarks: ['DLF Mall of India', 'Sector 18 Metro'] },
      { name: 'Sector 62', slug: 'sector-62', landmarks: ['Electronic City', 'Fortis Hospital'] }
    ]
  },
  {
    city: { name: 'Ghaziabad', slug: 'ghaziabad' },
    localities: [
      { name: 'Indirapuram', slug: 'indirapuram', landmarks: ['Shipra Mall', 'Swarn Jayanti Park'] },
      { name: 'Vaishali', slug: 'vaishali', landmarks: ['Mahagun Metro Mall'] }
    ]
  },
  {
    city: { name: 'Faridabad', slug: 'faridabad' },
    localities: [
      { name: 'NIT Faridabad', slug: 'nit-faridabad', landmarks: ['Badkal Lake', 'NIT Market'] },
      { name: 'Sector 15', slug: 'sector-15', landmarks: ['Crown Plaza'] }
    ]
  },
  {
    city: { name: 'Ranchi', slug: 'ranchi' },
    localities: [
      { name: 'Lalpur', slug: 'lalpur', landmarks: ['Nucleus Mall', 'Lalpur Chowk'] },
      { name: 'Morabadi', slug: 'morabadi', landmarks: ['Morabadi Maidan', 'Oxygen Park'] },
      { name: 'Hinoo', slug: 'hinoo', landmarks: ['Birsa Munda Airport'] }
    ]
  },
  {
    city: { name: 'Bengaluru', slug: 'bengaluru' },
    localities: [
      { name: 'Koramangala', slug: 'koramangala', landmarks: ['Sony World Signal', 'Forum Mall'] },
      { name: 'Indiranagar', slug: 'indiranagar', landmarks: ['100 Feet Road'] },
      { name: 'Whitefield', slug: 'whitefield', landmarks: ['ITPB', 'Phoenix Marketcity'] }
    ]
  }
];

async function main() {
  console.log('Seeding massive Location Data (Cities > Localities > Landmarks)...');
  
  for (const data of LOCATION_DATA) {
    // 1. Create/Update City
    const city = await prisma.city.upsert({
      where: { slug: data.city.slug },
      update: { name: data.city.name, isActive: true },
      create: { name: data.city.name, slug: data.city.slug, isActive: true },
    });
    
    // 2. Create Localities for this City
    for (const loc of data.localities) {
      const locality = await prisma.locality.upsert({
        where: { slug: loc.slug },
        update: { name: loc.name, cityId: city.id },
        create: { name: loc.name, slug: loc.slug, cityId: city.id },
      });

      // 3. Create Landmarks for this Locality
      for (const lmName of loc.landmarks) {
        const lmSlug = lmName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        await prisma.landmark.upsert({
          where: { slug: lmSlug },
          update: { name: lmName, localityId: locality.id },
          create: { name: lmName, slug: lmSlug, localityId: locality.id },
        });
      }
    }
    
    console.log(`✅ Seeded ${city.name} with its Localities and Landmarks.`);
  }

  console.log('Finished seeding completely!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
