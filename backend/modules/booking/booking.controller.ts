import { NextRequest } from 'next/server';
import { bookingService } from './booking.service';
import { createBookingSchema, updateBookingStatusSchema } from './booking.validator';
import { apiSuccess } from '@backend/utils/apiResponse';
import { handleError } from '@backend/middleware/errorHandler.middleware';
import { getOptionalAuthUser } from '@backend/middleware/auth.middleware';

export const bookingController = {
  async create(req: NextRequest) {
    try {
      const body = await req.json();
      const input = createBookingSchema.parse(body);
      const optionalUser = getOptionalAuthUser(req);
      const booking = await bookingService.createHourlyBooking(input, optionalUser?.userId);
      return apiSuccess(booking, undefined, 201);
    } catch (error) {
      return handleError(error);
    }
  },

  async getProviderBookings(user: import('@backend/middleware/auth.middleware').AuthenticatedUser) {
    try {
      const bookings = await bookingService.getProviderBookings(user.userId);
      return apiSuccess(bookings);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateStatus(
    req: NextRequest,
    user: import('@backend/middleware/auth.middleware').AuthenticatedUser,
    bookingId: string
  ) {
    try {
      const body = await req.json();
      const { status } = updateBookingStatusSchema.parse(body);
      const updated = await bookingService.updateBookingStatus(user.userId, bookingId, status);
      return apiSuccess(updated);
    } catch (error) {
      return handleError(error);
    }
  },

  async getUserBookings(req: NextRequest) {
    try {
      const optionalUser = getOptionalAuthUser(req);
      const phone = req.nextUrl.searchParams.get('phone') || undefined;
      const bookings = await bookingService.getUserBookings(optionalUser?.userId, phone);
      return apiSuccess(bookings);
    } catch (error) {
      return handleError(error);
    }
  },
};
