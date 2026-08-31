import { NextRequest } from 'next/server';
import { listingController } from '@backend/modules/listing/listing.controller';
import { withAuth } from '@backend/middleware/auth.middleware';

/**
 * @route DELETE /api/v1/provider/listings/[id]
 * @desc Soft delete a provider's listing
 * @access Private (Provider owner)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAuth(req, (user) => listingController.deleteListing(user, id));
}
