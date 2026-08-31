import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const brainDir = 'C:\\Users\\vikur\\.gemini\\antigravity\\brain\\062c34de-a9ab-4e0f-8b5e-098d3cba403a';

const imageMap: Record<string, string> = {
  gurugram: 'dlf_cyberhub_gurugram_1787655290689.jpg',
  noida: 'noida_city_1787654717941.jpg',
  ranchi: 'ranchi_city_1787654797187.jpg',
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> | { name: string } }
) {
  try {
    const rawParams = await context.params;
    const name = rawParams?.name?.toLowerCase();

    if (!name || !imageMap[name]) {
      return new NextResponse('City not found', { status: 404 });
    }

    const fileName = imageMap[name];
    const filePath = path.join(brainDir, fileName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Image file not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Auto-sync to public/cities so direct static path also gets populated
    try {
      const publicCitiesDir = path.join(process.cwd(), 'public', 'cities');
      if (!fs.existsSync(publicCitiesDir)) {
        fs.mkdirSync(publicCitiesDir, { recursive: true });
      }
      const publicFilePath = path.join(publicCitiesDir, `${name}.jpg`);
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
