import { prisma } from '@backend/utils/prisma';

export class LocationRepository {
  /**
   * Search for cities, localities, and landmarks simultaneously.
   * This uses Prisma's `contains` filter. In production with a huge DB, 
   * this would leverage PostgreSQL's pg_trgm indices for blazing fast results.
   */
  async searchAll(query: string, limit: number = 6) {
    const cleanQuery = query.trim();
    const [cities, localities, landmarks, listings] = await Promise.all([
      // 1. Search Cities
      prisma.city.findMany({
        where: {
          name: {
            contains: cleanQuery,
            mode: 'insensitive',
          },
          isActive: true,
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),

      // 2. Search Localities (including matching by their parent City name)
      prisma.locality.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery, mode: 'insensitive' } },
            { city: { name: { contains: cleanQuery, mode: 'insensitive' } } },
          ],
          isActive: true,
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          city: { select: { name: true, slug: true } },
        },
      }),

      // 3. Search Landmarks (including matching by Locality or City)
      prisma.landmark.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery, mode: 'insensitive' } },
            { locality: { name: { contains: cleanQuery, mode: 'insensitive' } } },
            { locality: { city: { name: { contains: cleanQuery, mode: 'insensitive' } } } },
          ],
          isActive: true,
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          locality: {
            select: {
              name: true,
              slug: true,
              city: { select: { name: true, slug: true } },
            },
          },
        },
      }),

      // 4. Search Active Listings for locations/addresses
      prisma.listing.findMany({
        where: {
          OR: [
            { address: { contains: cleanQuery, mode: 'insensitive' } },
            { title: { contains: cleanQuery, mode: 'insensitive' } },
          ],
          isActive: true,
          deletedAt: null,
        },
        take: limit,
        select: {
          id: true,
          title: true,
          address: true,
          city: { select: { name: true, slug: true } },
          locality: { select: { name: true, slug: true } },
        },
      }),
    ]);

    return { cities, localities, landmarks, listings };
  }
}
