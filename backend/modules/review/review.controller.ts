import { NextRequest } from 'next/server';
import { reviewService } from './review.service';
import { createReviewSchema } from './review.validator';
import { apiSuccess } from '@backend/utils/apiResponse';
import { handleError } from '@backend/middleware/errorHandler.middleware';
import { getOptionalAuthUser } from '@backend/middleware/auth.middleware';

export const reviewController = {
  async create(req: NextRequest) {
    try {
      const body = await req.json();
      const input = createReviewSchema.parse(body);
      const optionalUser = getOptionalAuthUser(req);
      const review = await reviewService.submitReview(input, optionalUser?.userId);
      return apiSuccess(review, undefined, 201);
    } catch (error) {
      return handleError(error);
    }
  },

  async getPendingReview(req: NextRequest) {
    try {
      const optionalUser = getOptionalAuthUser(req);
      const phone = req.nextUrl.searchParams.get('phone') || undefined;
      const pending = await reviewService.getPendingReview(optionalUser?.userId, phone);
      return apiSuccess(pending);
    } catch {
      return apiSuccess(null);
    }
  },

  async dismissReview(req: NextRequest) {
    try {
      const body = await req.json();
      if (!body.bookingId) {
        return apiSuccess({ dismissed: false });
      }
      await reviewService.dismissReview(body.bookingId);
      return apiSuccess({ dismissed: true });
    } catch (error) {
      return handleError(error);
    }
  },

  async getByListingId(req: NextRequest, listingId: string) {
    try {
      const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') || '1', 10));
      const limit = Math.max(1, Math.min(20, parseInt(req.nextUrl.searchParams.get('limit') || '6', 10)));
      const result = await reviewService.getListingReviews(listingId, page, limit);
      return apiSuccess(result.reviews, result.meta);
    } catch (error) {
      return handleError(error);
    }
  },
};
