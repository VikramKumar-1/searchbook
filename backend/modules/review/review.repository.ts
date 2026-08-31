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
        bookingId: data.bookingId || null,
        rating: data.rating,
        comment: data.comment,
        guestName: data.guestName || null,
        userId: data.userId || null,
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
      include: {
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

    // Find which bookings already have reviews
    const bookingIds = completedBookings.map((b) => b.id);
    const existingReviews = await prisma.review.findMany({
      where: {
        bookingId: { in: bookingIds },
        deletedAt: null,
      },
      select: { bookingId: true },
    });

    const reviewedBookingIds = new Set(existingReviews.map((r) => r.bookingId));

    // Return the first completed booking that hasn't been reviewed yet
    const pendingBooking = completedBookings.find((b) => !reviewedBookingIds.has(b.id));
    return pendingBooking || null;
  },

  async dismissPendingReview(_bookingId: string) {
    return null;
  },

  async findByListingId(listingId: string, page = 1, limit = 6) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { listingId, deletedAt: null },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { listingId, deletedAt: null } }),
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
