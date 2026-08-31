import { NextRequest } from 'next/server';
import { LocationController } from '@backend/modules/location/location.controller';

export async function GET(request: NextRequest) {
  return LocationController.search(request);
}
