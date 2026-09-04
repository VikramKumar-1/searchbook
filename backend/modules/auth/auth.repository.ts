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

  async findByPhone(phone: string) {
    return prisma.user.findFirst({
      where: { phone },
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

  async createWithPhone(data: { name: string; email: string; phone: string; role?: Role }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'USER',
      },
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

  async createWithOAuth(data: { name: string; email: string; avatar?: string }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        avatar: data.avatar || null,
        role: 'USER',
      },
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

  async updateProfile(id: string, data: { name?: string; phone?: string }) {
    return prisma.user.update({
      where: { id },
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

  async createProvider(data: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    password: string;
    businessName: string;
    businessType: string;
    govtIdType: string;
    govtIdNumber: string;
    govtIdPhoto: string;
    drivingLicenseNumber?: string;
    drivingLicensePhoto?: string;
    qualification?: string;
    medicalRegNumber?: string;
    certificatePhoto?: string;
    clinicAddress?: string;
    doesHomeVisit?: boolean;
    bio?: string;
    subjectsOrSpeciality?: string;
    kycStatus: string;
    legalAgreed: boolean;
    legalAgreedAt: Date;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        role: 'PROVIDER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        businessName: true,
        businessType: true,
        govtIdType: true,
        govtIdNumber: true,
        kycStatus: true,
        createdAt: true,
      },
    });
  },
};
