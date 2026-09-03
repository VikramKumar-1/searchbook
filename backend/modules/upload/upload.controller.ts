import { NextRequest } from 'next/server';
import { apiSuccess } from '@backend/utils/apiResponse';
import { BadRequestError } from '@backend/utils/errors';
import { handleError } from '@backend/middleware/errorHandler.middleware';
import { uploadService } from './upload.service';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/heic'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB raw file limit before compression

export const uploadController = {
  async uploadImages(req: NextRequest) {
    try {
      const formData = await req.formData();
      let files = formData.getAll('files') as File[];
      if (!files || files.length === 0) {
        files = formData.getAll('file') as File[];
      }

      if (!files || files.length === 0) {
        throw new BadRequestError('No image files provided for upload');
      }

      if (files.length > 10) {
        throw new BadRequestError('Maximum 10 images can be uploaded at once');
      }

      for (const file of files) {
        if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
          throw new BadRequestError(`File "${file.name}" is not a supported image format. Allowed: JPG, PNG, WEBP`);
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new BadRequestError(`File "${file.name}" exceeds 8MB size limit`);
        }
      }

      const result = await uploadService.uploadImages(files);
      return apiSuccess(result);
    } catch (error) {
      return handleError(error);
    }
  },
};
