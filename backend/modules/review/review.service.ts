import 'server-only';
import { reviewRepository } from './review.repository';
import { CreateReviewInput } from './review.validator';
import { BadRequestError } from '@backend/utils/errors';

export const reviewService = {
  async submitReview(input: CreateReviewInput, userId?: string) {
    if (input.rating < 1 || input.rating > 5) {
      throw new BadRequestError('Rating must be between 1 and 5 stars');
    }

    return reviewRepository.create({
      listingId: input.listingId,
      bookingId: input.bookingId,
      rating: input.rating,
      comment: input.comment,
      guestName: input.guestName,
      userId,
    });
  },

  async getPendingReview(userId?: string, phone?: string) {
    return reviewRepository.findPendingReviewForUser(userId, phone);
  },

  async dismissReview(bookingId: string) {
    return reviewRepository.dismissPendingReview(bookingId);
  },

  async getListingReviews(listingId: string, page = 1, limit = 6) {
    return reviewRepository.findByListingId(listingId, page, limit);
  },
};
