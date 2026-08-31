import { NextRequest } from 'next/server';
import { reviewController } from '@backend/modules/review/review.controller';

/**
 * @route GET /api/v1/user/pending-review
 * @desc Check if user has a completed checkout stay awaiting review
 * @access Public / Authenticated
 */
export async function GET(req: NextRequest) {
  return reviewController.getPendingReview(req);
}

/**
 * @route POST /api/v1/user/pending-review
 * @desc Dismiss pending review prompt
 * @access Public / Authenticated
 */
export async function POST(req: NextRequest) {
  return reviewController.dismissReview(req);
}
