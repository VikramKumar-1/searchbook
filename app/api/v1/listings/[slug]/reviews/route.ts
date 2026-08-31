import { NextRequest } from 'next/server';
import { reviewController } from '@backend/modules/review/review.controller';
import { listingRepository } from '@backend/modules/listing/listing.repository';
import { notFound } from 'next/navigation';
import { apiSuccess } from '@backend/utils/apiResponse';

/**
 * @route GET /api/v1/listings/[slug]/reviews
 * @desc Get paginated reviews for a listing (6 per page)
 * @access Public
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const listing = await listingRepository.findBySlug(slug);
  if (!listing) {
    return notFound();
  }
  return reviewController.getByListingId(req, listing.id);
}
