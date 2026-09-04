import 'server-only';
import { prisma } from '@backend/utils/prisma';

export const reviewRepository = {
  async create(data: {
    listingId: string;
    bookingId?: string;
    rating: number;
    comment: string;
    guestName?: string;
    userId?: string;
  }) {
    const review = await prisma.review.create({
      data: {
        listingId: data.listingId,
        rating: data.rating,
        comment: data.comment,
        userId: data.userId || '',
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        listing: { select: { id: true, title: true, slug: true } },
      },
    });

    return review;
  },

  async findPendingReviewForUser(userId?: string, phone?: string) {
    if (!userId && !phone) return null;

    // Find completed bookings for this user or phone
    const completedBookings = await prisma.booking.findMany({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(phone ? [{ guestPhone: phone }] : []),
        ],
        status: 'COMPLETED',
        deletedAt: null,
      },
      select: {
        id: true,
        bookingCode: true,
        listingId: true,
        guestName: true,
        guestPhone: true,
        checkInDate: true,
        checkInTime: true,
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            address: true,
            photos: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    if (!completedBookings.length) return null;

    // Find which listings by this user already have reviews
    const listingIds = completedBookings.map((b) => b.listingId);
    const existingReviews = await prisma.review.findMany({
      where: {
        listingId: { in: listingIds },
        ...(userId ? { userId } : {}),
      },
      select: { listingId: true, userId: true, createdAt: true },
    });

    const reviewedListingIds = new Set(existingReviews.map((r) => r.listingId));

    // Return the first completed booking for a listing that hasn't been reviewed yet
    const pendingBooking = completedBookings.find((b) => !reviewedListingIds.has(b.listingId));
    return pendingBooking || null;
  },

  async dismissPendingReview(_bookingId: string) {
    return null;
  },

  async findByListingId(listingId: string, page = 1, limit = 6) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { listingId },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { listingId } }),
    ]);

    return {
      reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
