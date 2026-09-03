import 'server-only';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { UploadResult, CloudinaryApiResponse } from './upload.types';
import { AppError } from '@backend/utils/errors';

function getCloudinaryCredentials(): { cloudName: string; apiKey: string; apiSecret: string } | null {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  let apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  let apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  // Support single CLOUDINARY_URL format if provided
  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    try {
      const parsedUrl = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
      apiKey = parsedUrl.username;
      apiSecret = parsedUrl.password;
      cloudName = parsedUrl.hostname;
    } catch {
      // Fall through if URL parsing fails
    }
  }

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }
  return null;
}

/**
 * Upload single image buffer to Cloudinary with WebP optimization
 */
async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string,
  credentials: { cloudName: string; apiKey: string; apiSecret: string }
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'searchbook/listings';

  // Cloudinary signature must be SHA1 of alphabetically sorted parameters + apiSecret
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${credentials.apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  // Convert buffer to base64 Data URI for fast multipart delivery
  const base64Data = buffer.toString('base64');
  const dataUri = `data:image/webp;base64,${base64Data}`;

  const formData = new FormData();
  formData.append('file', dataUri);
  formData.append('api_key', credentials.apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const json = (await response.json()) as CloudinaryApiResponse;

  if (!response.ok || !json.secure_url) {
    const errorMsg = json.error?.message || `Cloudinary upload failed with HTTP status ${response.status}`;
    console.error('[Cloudinary Upload Error]:', errorMsg);
    throw new AppError(errorMsg, 500, 'CLOUDINARY_UPLOAD_ERROR');
  }

  return json.secure_url;
}

/**
 * Fallback to local storage for development/offline mode
 */
async function uploadToLocal(buffer: Buffer, fileName: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(fileName).toLowerCase() || '.webp';
  const uniqueName = `listing_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  await fs.writeFile(filePath, buffer);
  return `/uploads/${uniqueName}`;
}

export const uploadService = {
  async uploadImages(files: File[]): Promise<UploadResult> {
    const credentials = getCloudinaryCredentials();
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (credentials) {
        // Production / Cloudinary Mode: Permanent high-speed CDN
        const cloudUrl = await uploadToCloudinary(buffer, file.name, credentials);
        uploadedUrls.push(cloudUrl);
      } else {
        // Fallback Local Mode (when Cloudinary keys are not yet configured)
        const localUrl = await uploadToLocal(buffer, file.name);
        uploadedUrls.push(localUrl);
      }
    }

    return {
      urls: uploadedUrls,
      url: uploadedUrls[0] || '',
      count: uploadedUrls.length,
    };
  },
};
