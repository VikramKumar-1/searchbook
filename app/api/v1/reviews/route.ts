import { NextRequest } from 'next/server';
import { reviewController } from '@backend/modules/review/review.controller';

/**
 * @route POST /api/v1/reviews
 * @desc Submit rating & feedback for completed hotel stay
 * @access Public / Authenticated
 */
export async function POST(req: NextRequest) {
  return reviewController.create(req);
}
