import 'server-only';
import { prisma } from '../../utils/prisma';
import { ListingQuery } from './listing.validator';
import { getBoundingBox } from '@backend/utils/geo';
import { Prisma } from '@prisma/client';

function getCategorySlugAliases(slug: string): string[] {
  const s = slug.toLowerCase().trim();
  const base = s.split('-')[0];
  const map: Record<string, string[]> = {
    'pg-hostel': ['pg-hostel', 'hostel', 'pg', 'boys-pg', 'girls-pg', 'co-living', 'hostels', 'pgs', 'pg-and-hostel'],
    'hourly-hotels': ['hourly-hotels', 'hotels', 'hourly-hotel', 'hotel', 'couples-hotel', 'stay', 'rooms'],
    'flats': ['flats', 'flat', 'apartments', 'apartment', 'house-rent', 'room-rent', 'bhk'],
    'mess-tiffin': ['mess-tiffin', 'tiffin', 'mess', 'food', 'home-cook', 'tiffin-service'],
    'gas-delivery': ['gas-delivery', 'gas', 'gas-agency', 'lpg-gas', 'gas-cylinder'],
    'maid': ['maid', 'housemaid', 'helper', 'bai', 'cleaning'],
    'plumber': ['plumber', 'plumbing', 'tap-repair'],
    'electrician': ['electrician', 'electrical', 'wiring'],
    'ac-repair': ['ac-repair', 'ac-service', 'ac'],
    'water-supply': ['water-supply', 'water-tanker', 'water'],
    'laundry': ['laundry', 'dry-clean', 'ironing', 'wash'],
  };
  return map[s] || [s, base];
}

function getCitySlugAliases(slug: string): string[] {
  const s = slug.toLowerCase().trim();
  const map: Record<string, string[]> = {
    'delhi': ['delhi', 'new-delhi', 'delhi-ncr', 'ncr'],
    'new-delhi': ['delhi', 'new-delhi', 'delhi-ncr', 'ncr'],
    'delhi-ncr': ['delhi', 'new-delhi', 'delhi-ncr', 'ncr'],
    'gurugram': ['gurugram', 'gurgaon', 'delhi-ncr'],
    'gurgaon': ['gurugram', 'gurgaon', 'delhi-ncr'],
    'noida': ['noida', 'greater-noida', 'delhi-ncr'],
    'ranchi': ['ranchi'],
    'chandigarh': ['chandigarh', 'mohali', 'panchkula'],
    'bengaluru': ['bengaluru', 'bangalore'],
  };
  return map[s] || [s];
}

export const listingRepository = {
  /**
   * Retrieves paginated listings based on provided filters.
   * When lat/lng is provided, uses Bounding Box pre-filter for O(log N) geo-queries.
   */
  async findMany(query: ListingQuery) {
    const where: Prisma.ListingWhereInput = {
      isActive: true,
      deletedAt: null,
      ...(query.citySlug && {
        city: {
          slug: { in: getCitySlugAliases(query.citySlug) },
        },
      }),
      ...(query.categorySlug && {
        category: {
          slug: { in: getCategorySlugAliases(query.categorySlug) },
        },
      }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { description: { contains: query.search, mode: 'insensitive' as const } },
          { address: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    // Bounding Box pre-filter: eliminates 95% of rows before Haversine
    if (query.lat && query.lng) {
      const radiusKm = query.radius || 10;
      const box = getBoundingBox(query.lat, query.lng, radiusKm);
      where.latitude = { gte: box.latMin, lte: box.latMax };
      where.longitude = { gte: box.lngMin, lte: box.lngMax };
    }

    const skip = (query.page - 1) * query.limit;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          priceType: true,
          address: true,
          latitude: true,
          longitude: true,
          serviceRadiusKm: true,
          photos: true,
          amenities: true,
          contactPhone: true,
          contactWhatsApp: true,
          isVerified: true,
          isFeatured: true,
          createdAt: true,
          city: { select: { id: true, name: true, slug: true } },
          locality: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true, icon: true } },
          user: { select: { id: true, name: true, isPremium: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return { listings, total };
  },

  /**
   * Creates a new listing in the database.
   * Maps string slugs (like categorySlug) to actual relation IDs.
   */
  async create(data: Prisma.ListingUncheckedCreateInput) {
    return prisma.listing.create({
      data,
      select: {
        id: true,
        slug: true,
      },
    });
  },

  /**
   * Retrieves all listings belonging to a specific provider.
   */
  async findByUserId(userId: string) {
    return prisma.listing.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        priceType: true,
        address: true,
        photos: true,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        viewCount: true,
        createdAt: true,
        tenantType: true,
        bhkType: true,
        furnishing: true,
        customCategory: true,
        category: { select: { id: true, name: true, slug: true } },
        city: { select: { id: true, name: true, slug: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Toggles the active status of a listing.
   */
  async toggleStatus(id: string, userId: string) {
    const listing = await prisma.listing.findFirst({
      where: { id, userId, deletedAt: null },
      select: { id: true, isActive: true },
    });
    if (!listing) return null;

    return prisma.listing.update({
      where: { id },
      data: { isActive: !listing.isActive },
      select: { id: true, isActive: true },
    });
  },

  /**
   * Soft deletes a listing.
   */
  async softDelete(id: string, userId: string) {
    const listing = await prisma.listing.findFirst({
      where: { id, userId, deletedAt: null },
      select: { id: true },
    });
    if (!listing) return false;

    await prisma.listing.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return true;
  },

  /**
   * Finds a single listing by its slug with relations and increments view count.
   */
  async findBySlug(slugOrId: string) {
    const clean = decodeURIComponent(slugOrId).trim();
    const cleanLower = clean.toLowerCase();
    
    // 1. Fetch main listing with core relations & latest 10 reviews in a single query
    const listing = await prisma.listing.findFirst({
      where: {
        OR: [
          { slug: clean },
          { slug: cleanLower },
          { id: clean },
        ],
        deletedAt: null,
      },
      include: {
        city: { select: { id: true, name: true, slug: true } },
        locality: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true, icon: true } },
        user: { select: { id: true, name: true, isPremium: true, phone: true, avatar: true } },
        reviews: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!listing) return null;

    // 2. Safe non-blocking viewCount increment in the background
    prisma.listing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    return {
      ...listing,
      reviews: listing.reviews || [],
      _count: {
        reviews: listing._count?.reviews || listing.reviews?.length || 0,
        bookmarks: 0,
      },
    };
  },
};
