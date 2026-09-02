import { NextResponse } from 'next/server';
import { prisma } from '@backend/utils/prisma';

const SEED_CITIES = [
  {
    name: 'Delhi NCR',
    slug: 'delhi',
    localities: [
      { name: 'Hauz Khas', slug: 'hauz-khas', landmarks: ['Hauz Khas Village', 'IIT Delhi'] },
      { name: 'Saket', slug: 'saket', landmarks: ['Select Citywalk', 'Saket Metro'] },
      { name: 'Lado Sarai', slug: 'lado-sarai', landmarks: ['Qutub Minar'] },
      { name: 'Kalu Sarai', slug: 'kalu-sarai', landmarks: ['FIITJEE Hub', 'IIT Flyover'] },
      { name: 'Laxmi Nagar', slug: 'laxmi-nagar', landmarks: ['V3S Mall', 'Laxmi Nagar Metro'] },
      { name: 'Mukherjee Nagar', slug: 'mukherjee-nagar', landmarks: ['Batra Cinema', 'GTB Nagar'] },
    ],
  },
  {
    name: 'Gurugram',
    slug: 'gurugram',
    localities: [
      { name: 'DLF Phase 2', slug: 'dlf-phase-2', landmarks: ['Cyber Hub', 'MG Road Metro'] },
      { name: 'Sector 14', slug: 'sector-14', landmarks: ['Sector 14 Market'] },
      { name: 'Golf Course Road', slug: 'golf-course-road', landmarks: ['Horizon Center'] },
    ],
  },
  {
    name: 'Noida',
    slug: 'noida',
    localities: [
      { name: 'Sector 18', slug: 'sector-18', landmarks: ['DLF Mall of India', 'Atta Market'] },
      { name: 'Sector 62', slug: 'sector-62', landmarks: ['Electronic City', 'Fortis Hospital'] },
    ],
  },
  {
    name: 'Ranchi',
    slug: 'ranchi',
    localities: [
      { name: 'Lalpur', slug: 'lalpur', landmarks: ['Nucleus Mall', 'Lalpur Chowk'] },
      { name: 'Morabadi', slug: 'morabadi', landmarks: ['Morabadi Maidan', 'Oxygen Park'] },
      { name: 'Hinoo', slug: 'hinoo', landmarks: ['Birsa Munda Airport'] },
    ],
  },
  {
    name: 'Chandigarh',
    slug: 'chandigarh',
    localities: [
      { name: 'Sector 17', slug: 'sector-17', landmarks: ['Sector 17 Plaza'] },
      { name: 'Mohali', slug: 'mohali', landmarks: ['PCA Stadium', 'Phase 7'] },
    ],
  },
];

const SEED_CATEGORIES = [
  { name: 'Hourly Hotels', slug: 'hourly-hotels', icon: '🏨' },
  { name: 'PG & Hostels', slug: 'pg-hostel', icon: '🏠' },
  { name: 'Flats & Apartments', slug: 'flats', icon: '🏢' },
  { name: 'Mess & Tiffin Services', slug: 'mess-tiffin', icon: '🍱' },
  { name: 'LPG Gas Delivery', slug: 'gas-delivery', icon: '🔥' },
  { name: 'Housemaid & Helper', slug: 'maid', icon: '🧹' },
  { name: 'Plumber', slug: 'plumber', icon: '🔧' },
  { name: 'Electrician', slug: 'electrician', icon: '⚡' },
];

export async function GET() {
  try {
    // 1. Seed Cities, Localities & Landmarks
    for (const cityData of SEED_CITIES) {
      const city = await prisma.city.upsert({
        where: { slug: cityData.slug },
        update: { name: cityData.name, isActive: true },
        create: { name: cityData.name, slug: cityData.slug, isActive: true },
      });

      for (const loc of cityData.localities) {
        const locality = await prisma.locality.upsert({
          where: { slug: loc.slug },
          update: { name: loc.name, cityId: city.id },
          create: { name: loc.name, slug: loc.slug, cityId: city.id },
        });

        for (const lm of loc.landmarks) {
          const lmSlug = lm.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          await prisma.landmark.upsert({
            where: { slug: lmSlug },
            update: { name: lm, localityId: locality.id },
            create: { name: lm, slug: lmSlug, localityId: locality.id },
          });
        }
      }
    }

    // 2. Seed Categories
    for (const cat of SEED_CATEGORIES) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, icon: cat.icon },
        create: { name: cat.name, slug: cat.slug, icon: cat.icon },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cities, localities, landmarks, and categories seeded successfully!',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during seeding';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
