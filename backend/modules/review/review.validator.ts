import { z } from 'zod';

export const createReviewSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  bookingId: z.string().optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().min(5, 'Feedback must be at least 5 characters').max(300, 'Feedback cannot exceed 300 characters'),
  guestName: z.string().max(100).optional(),
}).strict();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
