import { NextRequest } from 'next/server';
import { uploadController } from '@backend/modules/upload/upload.controller';

/**
 * @route POST /api/v1/upload
 * @desc Upload single or multiple images (up to 10 photos, max 5MB each)
 * @access Public / Provider
 */
export async function POST(req: NextRequest) {
  return uploadController.uploadImages(req);
}
