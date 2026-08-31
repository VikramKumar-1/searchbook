import { NextResponse } from 'next/server';
import { prisma } from '@backend/utils/prisma';

export async function GET() {
  try {
    // 1. Create a dummy city
    const city = await prisma.city.upsert({
      where: { slug: 'delhi-ncr' },
      update: {},
      create: { name: 'Delhi NCR', slug: 'delhi-ncr' },
    });

    // 2. Create a dummy category
    const category = await prisma.category.upsert({
      where: { slug: 'pg-hostel' },
      update: {},
      create: { name: 'PG & Hostels', slug: 'pg-hostel' },
    });

    // 3. Create a dummy user
    const user = await prisma.user.upsert({
      where: { email: 'test@searchbook.com' },
      update: {},
      create: { name: 'Test Provider', email: 'test@searchbook.com', role: 'PROVIDER' },
    });

    // 4. Create dummy listings
    await prisma.listing.createMany({
      data: [
        {
          title: 'Premium Boys PG in Kalu Sarai',
          slug: 'premium-boys-pg-kalu-sarai',
          description: 'Fully furnished AC rooms with 3 times meals and high-speed WiFi.',
          price: 12000,
          priceType: 'PER_MONTH',
          address: 'Kalu Sarai, Hauz Khas, Delhi',
          photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
          contactPhone: '+919876543210',
          userId: user.id,
          cityId: city.id,
          categoryId: category.id,
        },
        {
          title: 'Luxury Girls Hostel Near DU',
          slug: 'luxury-girls-hostel-du',
          description: 'Safe and secure luxury hostel for girls with attached washrooms.',
          price: 15000,
          priceType: 'PER_MONTH',
          address: 'North Campus, Delhi University',
          photos: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'],
          contactPhone: '+919876543211',
          userId: user.id,
          cityId: city.id,
          categoryId: category.id,
        },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during seeding';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
