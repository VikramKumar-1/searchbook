/**
 * Utility to convert and compress any uploaded image (JPG, PNG, HEIC) to ultra-crisp WebP.
 * Preserves high visual quality (quality 0.88-0.90) with high smoothing quality.
 * Downscales giant photos (e.g. 4000x3000 phone camera shots) to a max dimension of 1920px
 * so file size drops from ~8MB down to ~200KB with ZERO perceptible quality loss.
 */
export async function convertToWebP(file: File, maxDimension = 1920, quality = 0.88): Promise<File> {
  return new Promise((resolve, reject) => {
    // If browser doesn't support canvas/image or file is not an image, return as is
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize down if larger than maxDimension (e.g. 1920px for HD clarity)
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Enable highest quality bicubic interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const webpFile = new File([blob], `${baseName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        // Fallback to original file if image decoding fails
        resolve(file);
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}
