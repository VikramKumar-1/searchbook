import { NextRequest } from 'next/server';
import { listingController } from '@backend/modules/listing/listing.controller';
import { withAuth } from '@backend/middleware/auth.middleware';

/**
 * @route PATCH /api/v1/provider/listings/[id]/status
 * @desc Toggle active / paused status of a listing
 * @access Private (Provider owner)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAuth(req, (user) => listingController.toggleStatus(user, id));
}
