import { NextRequest } from 'next/server';
import { listingController } from '@backend/modules/listing/listing.controller';

/**
 * @route GET /api/v1/listings/[slug]
 * @desc Get single listing by slug with city, locality, category, and review relations
 * @access Public
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = await params;
  return listingController.getBySlug(resolvedParams.slug);
}
