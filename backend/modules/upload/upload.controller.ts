import { NextRequest } from 'next/server';
import { apiSuccess } from '@backend/utils/apiResponse';
import { BadRequestError } from '@backend/utils/errors';
import { handleError } from '@backend/middleware/errorHandler.middleware';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

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

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      // Ensure uploads directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          throw new BadRequestError(`File "${file.name}" is not a supported image format. Allowed: JPG, PNG, WEBP`);
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new BadRequestError(`File "${file.name}" exceeds 5MB size limit`);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let ext = path.extname(file.name).toLowerCase();
        if (!ext) {
          ext = file.type === 'image/webp' ? '.webp' : file.type === 'image/png' ? '.png' : '.jpg';
        }
        const randomName = `listing_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
        const filePath = path.join(uploadDir, randomName);

        await fs.writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${randomName}`);
      }

      return apiSuccess({ urls: uploadedUrls, url: uploadedUrls[0] });
    } catch (error) {
      return handleError(error);
    }
  },
};
