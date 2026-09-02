import { NextRequest, NextResponse } from 'next/server';
import { LocationService } from './location.service';
import { locationSearchSchema } from './location.validator';
import { z } from 'zod';

const locationService = new LocationService();

export class LocationController {
  static async search(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams;
      const query = searchParams.get('q') || '';

      // Validate input
      const validatedData = locationSearchSchema.parse({ q: query });

      // Call Service
      const results = await locationService.search(validatedData.q);

      return NextResponse.json(
        {
          success: true,
          data: results,
        },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: error.issues[0]?.message || 'Invalid search query' } },
          { status: 400 }
        );
      }
      
      console.error('Location search error:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to search locations' } },
        { status: 500 }
      );
    }
  }
}
