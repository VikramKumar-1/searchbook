import 'server-only';
import { bookingRepository } from './booking.repository';
import { prisma } from '@backend/utils/prisma';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@backend/utils/errors';
import type { CreateBookingInput, UpdateBookingStatusInput } from './booking.validator';
import { BookingStatus, StayPackage } from '@prisma/client';

/**
 * Calculates dynamic package price based on the hotel owner's set 24h price.
 */
export function calculatePackagePrice(basePrice: number, pkg: StayPackage): number {
  if (basePrice <= 950) {
    if (pkg === 'HOURLY_2H') return 199;
    if (pkg === 'HOURLY_3H') return 299;
    if (pkg === 'HOURLY_6H') return 499;
    if (pkg === 'DAY_ONLY') return 599;
    if (pkg === 'NIGHT_ONLY') return 699;
    return Math.round(basePrice) || 899;
  }

  // Deluxe Hotels (> ₹950)
  if (pkg === 'HOURLY_2H') return Math.max(199, Math.round((basePrice * 0.23) / 10) * 10 - 1);
  if (pkg === 'HOURLY_3H') return Math.max(299, Math.round((basePrice * 0.34) / 10) * 10 - 1);
  if (pkg === 'HOURLY_6H') return Math.max(499, Math.round((basePrice * 0.55) / 10) * 10 - 1);
  if (pkg === 'DAY_ONLY') return Math.max(599, Math.round((basePrice * 0.67) / 10) * 10 - 1);
  if (pkg === 'NIGHT_ONLY') return Math.max(699, Math.round((basePrice * 0.78) / 10) * 10 - 1);
  return Math.round(basePrice);
}

/**
 * Converts "02:00 PM" to minutes from midnight (e.g. 14*60 = 840)
 */
function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const min = parseInt(match[2], 10) || 0;
  const period = match[3]?.toUpperCase();
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour * 60 + min;
}

/**
 * Checks if two time intervals overlap on the same day
 */
function doIntervalsOverlap(startA: number, durationA: number, startB: number, durationB: number): boolean {
  const endA = startA + durationA * 60;
  const endB = startB + durationB * 60;
  return startA < endB && startB < endA;
}

/**
 * Calculates human-readable check-out time from check-in time and duration.
 */
function calculateCheckOutTime(checkInTime: string, durationHours: number): string {
  const match = checkInTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return `${durationHours} Hours Stay`;

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3]?.toUpperCase();

  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  const totalHours = hour + durationHours;
  const isNextDay = totalHours >= 24;
  const outHour24 = totalHours % 24;

  const outPeriod = outHour24 >= 12 ? 'PM' : 'AM';
  let outHour12 = outHour24 % 12;
  if (outHour12 === 0) outHour12 = 12;

  const formattedHour = outHour12 < 10 ? `0${outHour12}` : `${outHour12}`;
  return `${formattedHour}:${minute} ${outPeriod}${isNextDay ? ' (Next Day)' : ''}`;
}

export const bookingService = {
  async getAvailability(listingId: string, date: string) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, totalRooms: true },
    });

    if (!listing) throw new NotFoundError('Hotel listing not found');
    const totalRooms = listing.totalRooms || 5;

    // Fetch active bookings for this hotel on this date
    const activeBookings = await prisma.booking.findMany({
      where: {
        listingId,
        checkInDate: date,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        deletedAt: null,
      },
      select: {
        id: true,
        checkInTime: true,
        checkOutTime: true,
        durationHours: true,
        stayPackage: true,
      },
    });

    return {
      totalRooms,
      activeBookings,
    };
  },

  async createHourlyBooking(input: CreateBookingInput, userId?: string | null) {
    const listing = await prisma.listing.findUnique({
      where: { id: input.listingId },
      select: {
        id: true,
        title: true,
        price: true,
        priceType: true,
        totalRooms: true,
        isActive: true,
        openingTime: true,
        closingTime: true,
      },
    });

    if (!listing || !listing.isActive) {
      throw new NotFoundError('Hotel listing not found or is currently inactive');
    }

    const totalRooms = listing.totalRooms || 5;
    const pkg: StayPackage = (input.stayPackage as StayPackage) || 'HOURLY_2H';
    const hotelBasePrice = listing.price ? Number(listing.price) : 899;
    const totalAmount = calculatePackagePrice(hotelBasePrice, pkg);

    let checkInTime = input.checkInTime;
    let checkOutTime = input.checkOutTime || '';
    let durationHours = input.durationHours || 2;

    if (pkg === 'DAY_ONLY') {
      checkInTime = '09:00 AM';
      checkOutTime = '06:00 PM';
      durationHours = 9;
    } else if (pkg === 'NIGHT_ONLY') {
      checkInTime = '08:00 PM';
      checkOutTime = '08:00 AM (Next Day)';
      durationHours = 12;
    } else if (pkg === 'FULL_DAY') {
      checkInTime = '12:00 PM';
      checkOutTime = '11:00 AM (Next Day)';
      durationHours = 24;
    } else if (!checkOutTime) {
      checkOutTime = calculateCheckOutTime(checkInTime, durationHours);
    }

    // ── REAL-TIME ROOM INVENTORY & CONFLICT CHECK ──
    const targetStartMins = parseTimeToMinutes(checkInTime);

    const existingBookings = await prisma.booking.findMany({
      where: {
        listingId: input.listingId,
        checkInDate: input.checkInDate,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        deletedAt: null,
      },
      select: { checkInTime: true, durationHours: true },
    });

    const overlappingCount = existingBookings.filter((b) => {
      const bStart = parseTimeToMinutes(b.checkInTime);
      return doIntervalsOverlap(targetStartMins, durationHours, bStart, b.durationHours);
    }).length;

    if (overlappingCount >= totalRooms) {
      throw new BadRequestError(
        `All ${totalRooms} rooms for this time slot (${checkInTime} to ${checkOutTime}) are currently full. Please pick a different time.`
      );
    }

    // Generate unique 6-character booking code (e.g. SB-H7842)
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `SB-H${randomCode}`;

    return bookingRepository.create({
      bookingCode,
      listingId: input.listingId,
      guestName: input.guestName,
      guestPhone: input.guestPhone,
      guestEmail: input.guestEmail || null,
      checkInDate: input.checkInDate,
      checkInTime,
      checkOutTime,
      durationHours,
      stayPackage: pkg,
      guestsCount: input.guestsCount,
      specialRequests: input.specialRequests || null,
      guestIdType: input.guestIdType || null,
      guestIdNumber: input.guestIdNumber || null,
      guestIdPhoto: input.guestIdPhoto || null,
      totalAmount,
      paymentType: 'PAY_AT_HOTEL',
      status: 'CONFIRMED',
      userId: userId || null,
    });
  },

  async getProviderBookings(providerUserId: string) {
    return bookingRepository.findByProviderUserId(providerUserId);
  },

  async updateBookingStatus(providerUserId: string, bookingId: string, status: BookingStatus) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.listing.userId !== providerUserId) {
      throw new UnauthorizedError('You are not authorized to manage this booking');
    }

    return bookingRepository.updateStatus(bookingId, status);
  },

  async getUserBookings(userId?: string, phone?: string) {
    return bookingRepository.findByUser(userId, phone);
  },
};
