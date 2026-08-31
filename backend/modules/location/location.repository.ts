import { prisma } from '@backend/utils/prisma';

export class LocationRepository {
  /**
   * Search for cities, localities, and landmarks simultaneously.
   * This uses Prisma's `contains` filter. In production with a huge DB, 
   * this would leverage PostgreSQL's pg_trgm indices for blazing fast results.
   */
  async searchAll(query: string, limit: number = 5) {
    const [cities, localities, landmarks] = await Promise.all([
      // 1. Search Cities
      prisma.city.findMany({
        where: {
          name: {
            contains: query,
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
            { name: { contains: query, mode: 'insensitive' } },
            { city: { name: { contains: query, mode: 'insensitive' } } }
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
            { name: { contains: query, mode: 'insensitive' } },
            { locality: { name: { contains: query, mode: 'insensitive' } } },
            { locality: { city: { name: { contains: query, mode: 'insensitive' } } } }
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
    ]);

    return { cities, localities, landmarks };
  }
}
