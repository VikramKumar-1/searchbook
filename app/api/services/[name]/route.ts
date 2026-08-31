import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const brainDir = 'C:\\Users\\vikur\\.gemini\\antigravity\\brain\\062c34de-a9ab-4e0f-8b5e-098d3cba403a';

const serviceImageMap: Record<string, string> = {
  gas: 'gas_delivery_boy_1787655535809.jpg',
  maid: 'maid_pure_white_1787653388315.jpg',
  cook: 'cook_pure_white_1787653444015.jpg',
  water: 'water_boy_pure_white_1787653367894.jpg',
  flat: 'flat_listing_1787658551259.jpg',
  tiffin: 'tiffin_mess_listing_1787658569849.jpg',
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> | { name: string } }
) {
  try {
    const rawParams = await context.params;
    const name = rawParams?.name?.toLowerCase();

    if (!name || !serviceImageMap[name]) {
      return new NextResponse('Service not found', { status: 404 });
    }

    const fileName = serviceImageMap[name];
    const filePath = path.join(brainDir, fileName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Image file not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Auto-sync to public/services so direct static path works too
    try {
      const publicServicesDir = path.join(process.cwd(), 'public', 'services');
      if (!fs.existsSync(publicServicesDir)) {
        fs.mkdirSync(publicServicesDir, { recursive: true });
      }
      const publicFilePath = path.join(publicServicesDir, `${name}.jpg`);
      fs.writeFileSync(publicFilePath, fileBuffer);
    } catch {
      // ignore
    }

    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse(`Error serving image: ${message}`, { status: 500 });
  }
}
