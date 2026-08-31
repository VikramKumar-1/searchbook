import { prisma } from '@backend/utils/prisma';
import type { Role } from '@prisma/client';

export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,      
        role: true,
        avatar: true,
        isPremium: true,
        createdAt: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        isPremium: true,
        createdAt: true,
      },
    });
  },

  async create(data: { name: string; email: string; phone?: string; password: string; role: Role }) {
    return prisma.user.create({
      data,  
      select: { 
        id: true,       
        name: true,
        email: true,        
        phone: true,
        role: true,
        avatar: true,
        isPremium: true,
        createdAt: true,
      },
    });
  },
};
