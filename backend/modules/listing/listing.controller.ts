import { NextRequest } from 'next/server';
import { listingService } from './listing.service';
import { listingQuerySchema } from './listing.validator';
import { apiSuccess } from '../../utils/apiResponse';
import { handleError } from '../../middleware/errorHandler.middleware';

export const listingController = {
  async getAll(req: NextRequest) {
    try {
      const searchParams = Object.fromEntries(req.nextUrl.searchParams);
      const query = listingQuerySchema.parse(searchParams);
      const result = await listingService.getListings(query);
      return apiSuccess(result.data, result.meta);
    } catch (error) {
      return handleError(error);
    }
  },

  async create(req: NextRequest, user: import('../../middleware/auth.middleware').AuthenticatedUser) {
    try {
      const { createListingSchema } = await import('./listing.validator');
      const input = createListingSchema.parse(await req.json());
      const result = await listingService.createListing(user.userId, input);
      return apiSuccess(result, undefined, 201);
    } catch (error) {
      return handleError(error);
    }
  },

  async getProviderDashboard(user: import('../../middleware/auth.middleware').AuthenticatedUser) {
    try {
      const result = await listingService.getProviderDashboard(user.userId);
      return apiSuccess(result);
    } catch (error) {
      return handleError(error);
    }
  },

  async toggleStatus(user: import('../../middleware/auth.middleware').AuthenticatedUser, listingId: string) {
    try {
      const result = await listingService.toggleListingStatus(user.userId, listingId);
      return apiSuccess(result);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteListing(user: import('../../middleware/auth.middleware').AuthenticatedUser, listingId: string) {
    try {
      const result = await listingService.deleteListing(user.userId, listingId);
      return apiSuccess(result);
    } catch (error) {
      return handleError(error);
    }
  },

  async getBySlug(slug: string) {
    try {
      const result = await listingService.getListingBySlug(slug);
      return apiSuccess(result);
    } catch (error) {
      return handleError(error);
    }
  },
};
