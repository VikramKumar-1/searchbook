import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { name, base64 } = await req.json();
    if (!name || !base64) {
      return NextResponse.json({ success: false, error: 'Missing name or base64' }, { status: 400 });
    }

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const destDir = path.join(process.cwd(), 'public', 'services');
    await fs.mkdir(destDir, { recursive: true });

    const filePath = path.join(destDir, `${name}.png`);
    await fs.writeFile(filePath, buffer);

    console.log(`[SaveTransparent] Saved public/services/${name}.png (${buffer.length} bytes)`);
    return NextResponse.json({ success: true, file: `/services/${name}.png` });
  } catch (error) {
    console.error('[SaveTransparent Error]:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
