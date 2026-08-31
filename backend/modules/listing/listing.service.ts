import 'server-only';
import { listingRepository } from './listing.repository';
import { ListingQuery } from './listing.validator';
import { getPaginationMeta } from '../../utils/pagination';
import { haversineDistance, calculateScore } from '@backend/utils/geo';

interface ScoredListing {
  distanceKm: number | null;
  score: number;
  [key: string]: unknown;
}

export const listingService = {
  async getListings(query: ListingQuery) {
    const { listings, total } = await listingRepository.findMany(query);
    const meta = getPaginationMeta(total, query.page, query.limit);

    // If user provided lat/lng, calculate exact distance + score for each listing
    if (query.lat && query.lng) {
      const userLat = query.lat;
      const userLng = query.lng;
      const maxRadius = query.radius || 10;

      const scoredListings = listings
        .map((listing) => {
          // Calculate exact distance using Haversine (O(1) per listing)
          const distanceKm = (listing.latitude && listing.longitude)
            ? haversineDistance(userLat, userLng, listing.latitude, listing.longitude)
            : null;

          // For roaming services (plumber etc): check if user is within provider's radius
          if (listing.serviceRadiusKm && distanceKm !== null) {
            if (distanceKm > listing.serviceRadiusKm) {
              return null; // Provider doesn't serve this area
            }
          }

          // For fixed locations (flats etc): check if within search radius
          if (!listing.serviceRadiusKm && distanceKm !== null) {
            if (distanceKm > maxRadius) {
              return null; // Too far
            }
          }

          // Calculate ranking score
          const score = calculateScore({
            distanceKm: distanceKm || maxRadius,
            maxRadiusKm: maxRadius,
            avgRating: 4.0, // TODO: Calculate from reviews when we have them
            createdAt: listing.createdAt,
            isVerified: listing.isVerified,
            isPremium: listing.user?.isPremium || false,
          });

          return {
            ...listing,
            distanceKm: distanceKm ? Math.round(distanceKm * 10) / 10 : null, // Round to 1 decimal
            score,
          };
        })
        .filter((l): l is NonNullable<typeof l> => l !== null)
        .sort((a, b) => b.score - a.score); // Best score first

      return {
        data: scoredListings,
        meta: { ...meta, total: scoredListings.length },
      };
    }

    // No geo-search: return listings as-is (sorted by createdAt from repository)
    return {
      data: listings.map((l) => ({ ...l, distanceKm: null, score: 0 })),
      meta,
    };
  },

  async createListing(userId: string, input: import('./listing.validator').CreateListingInput) {
    const { prisma } = await import('../../utils/prisma');
    
    // 1. Resolve or Auto-Create Category
    let category = await prisma.category.findUnique({ where: { slug: input.categorySlug } });
    if (!category) {
      const formattedCategoryName = input.categorySlug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      category = await prisma.category.upsert({
        where: { slug: input.categorySlug },
        update: {},
        create: {
          name: formattedCategoryName,
          slug: input.categorySlug,
        },
      });
    }

    // 2. Resolve or Auto-Create City
    let city = await prisma.city.findUnique({ where: { slug: input.citySlug } });
    if (!city) {
      const formattedCityName = input.citySlug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      city = await prisma.city.upsert({
        where: { slug: input.citySlug },
        update: {},
        create: {
          name: formattedCityName,
          slug: input.citySlug,
        },
      });
    }

    // 3. Resolve or Auto-Create Locality
    let localityId = null;
    if (input.localitySlug && city) {
      let locality = await prisma.locality.findUnique({ where: { slug: input.localitySlug } });
      if (!locality) {
        const formattedLocalityName = input.localitySlug
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        locality = await prisma.locality.upsert({
          where: { slug: input.localitySlug },
          update: {},
          create: {
            name: formattedLocalityName,
            slug: input.localitySlug,
            cityId: city.id,
          },
        });
      }
      localityId = locality?.id || null;
    }

    // 2. Generate unique slug
    const baseSlug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;

    // 3. Create listing
    return listingRepository.create({
      title: input.title,
      slug: uniqueSlug,
      description: input.description,
      address: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      price: input.price,
      priceType: input.priceType,
      serviceRadiusKm: input.serviceRadiusKm,
      tenantType: input.tenantType,
      furnishing: input.furnishing,
      bhkType: input.bhkType,
      openingTime: input.openingTime,
      closingTime: input.closingTime,
      totalRooms: input.totalRooms || 5,
      customCategory: input.customCategory,
      amenities: input.amenities,
      photos: input.photos,
      contactPhone: input.contactPhone,
      contactWhatsApp: input.contactWhatsApp,
      userId,
      categoryId: category.id,
      cityId: city.id,
      localityId,
    });
  },

  async getProviderDashboard(userId: string) {
    const listings = await listingRepository.findByUserId(userId);
    
    // Calculate stats
    const totalListings = listings.length;
    const activeListings = listings.filter(l => l.isActive).length;
    const totalViews = listings.reduce((acc, l) => acc + (l.viewCount || 0), 0);
    const totalReviews = listings.reduce((acc, l) => acc + (l._count?.reviews || 0), 0);

    return {
      listings,
      stats: {
        totalListings,
        activeListings,
        pausedListings: totalListings - activeListings,
        totalViews,
        totalReviews,
      },
    };
  },

  async toggleListingStatus(userId: string, listingId: string) {
    const updated = await listingRepository.toggleStatus(listingId, userId);
    if (!updated) {
      throw new Error('Listing not found or unauthorized');
    }
    return updated;
  },

  async deleteListing(userId: string, listingId: string) {
    const success = await listingRepository.softDelete(listingId, userId);
    if (!success) {
      throw new Error('Listing not found or unauthorized');
    }
    return { success: true, message: 'Listing deleted successfully' };
  },

  async getListingBySlug(slug: string) {
    const listing = await listingRepository.findBySlug(slug);
    if (!listing) {
      throw new Error(`Listing with slug "${slug}" not found`);
    }
    return listing;
  },
};
