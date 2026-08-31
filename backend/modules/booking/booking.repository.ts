import 'server-only';
import { prisma } from '@backend/utils/prisma';
import { Prisma, BookingStatus } from '@prisma/client';

export const bookingRepository = {
  async create(data: Prisma.BookingUncheckedCreateInput) {
    return prisma.booking.create({
      data,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            address: true,
            contactPhone: true,
            photos: true,
          },
        },
      },
    });
  },

  async findByProviderUserId(providerUserId: string) {
    return prisma.booking.findMany({
      where: {
        listing: {
          userId: providerUserId,
        },
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
            price: true,
            priceType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            userId: true,
            contactPhone: true,
          },
        },
      },
    });
  },

  async updateStatus(bookingId: string, status: BookingStatus) {
    return prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  async findByUser(userId?: string, guestPhone?: string) {
    if (!userId && !guestPhone) return [];

    return prisma.booking.findMany({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(guestPhone ? [{ guestPhone }] : []),
        ],
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
            price: true,
            priceType: true,
            contactPhone: true,
            city: { select: { id: true, name: true, slug: true } },
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
