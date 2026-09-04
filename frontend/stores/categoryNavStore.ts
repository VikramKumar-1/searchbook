import { create } from 'zustand';

export type MobileCategoryKey = 'all' | 'pg-hostel' | 'hourly-hotels' | 'flats' | 'services' | 'tiffin';

export interface CategoryTheme {
  primary: string;
  navBg: string;
  bgGradient: string;
  bentoBg: string;
  bannerGradient: string;
  bannerTagText: string;
  bannerTitleText: string;
  activePillBg: string;
  activePillText: string;
  indicatorColor: string;
  accentBadgeBg: string;
  accentBadgeText: string;
}

export const CATEGORY_THEMES: Record<MobileCategoryKey, CategoryTheme> = {
  all: {
    primary: '#0033CC',
    navBg: 'bg-[#A0D7F7]',
    bgGradient: 'from-[#A0D7F7] via-[#C6EBFB] to-[#EDF8FD]',
    bentoBg: 'bg-[#6E96CB]',
    bannerGradient: 'from-[#D7F5F7] via-[#E8FAFA] to-[#CEEFF5]',
    bannerTagText: 'text-[#1E6B8A]',
    bannerTitleText: 'text-[#155A75]',
    activePillBg: 'bg-white',
    activePillText: 'text-gray-950',
    indicatorColor: 'bg-gray-950',
    accentBadgeBg: 'bg-[#FFCC00]',
    accentBadgeText: 'text-black',
  },
  'pg-hostel': {
    primary: '#1D4ED8', // Royal Blue
    navBg: 'bg-[#93C5FD]',
    bgGradient: 'from-[#93C5FD] via-[#BFDBFE] to-[#EFF6FF]',
    bentoBg: 'bg-[#3B82F6]',
    bannerGradient: 'from-[#DBEAFE] via-[#EFF6FF] to-[#E0E7FF]',
    bannerTagText: 'text-[#1D4ED8]',
    bannerTitleText: 'text-[#1E40AF]',
    activePillBg: 'bg-blue-600',
    activePillText: 'text-blue-900',
    indicatorColor: 'bg-blue-600',
    accentBadgeBg: 'bg-[#FDE047]',
    accentBadgeText: 'text-black',
  },
  'hourly-hotels': {
    primary: '#E11D48', // Vibrant Rose
    navBg: 'bg-[#FDA4AF]',
    bgGradient: 'from-[#FDA4AF] via-[#FECDD3] to-[#FFF1F2]',
    bentoBg: 'bg-[#F43F5E]',
    bannerGradient: 'from-[#FFE4E6] via-[#FFF1F2] to-[#FCE7F3]',
    bannerTagText: 'text-[#BE123C]',
    bannerTitleText: 'text-[#9F1239]',
    activePillBg: 'bg-rose-600',
    activePillText: 'text-rose-900',
    indicatorColor: 'bg-rose-600',
    accentBadgeBg: 'bg-[#FDE047]',
    accentBadgeText: 'text-black',
  },
  flats: {
    primary: '#059669', // Emerald Mint
    navBg: 'bg-[#6EE7B7]',
    bgGradient: 'from-[#6EE7B7] via-[#A7F3D0] to-[#ECFDF5]',
    bentoBg: 'bg-[#10B981]',
    bannerGradient: 'from-[#D1FAE5] via-[#ECFDF5] to-[#E6FFFA]',
    bannerTagText: 'text-[#047857]',
    bannerTitleText: 'text-[#065F46]',
    activePillBg: 'bg-emerald-600',
    activePillText: 'text-emerald-900',
    indicatorColor: 'bg-emerald-600',
    accentBadgeBg: 'bg-[#FDE047]',
    accentBadgeText: 'text-black',
  },
  services: {
    primary: '#D97706', // Honey Amber
    navBg: 'bg-[#FCD34D]',
    bgGradient: 'from-[#FCD34D] via-[#FDE68A] to-[#FFFBEB]',
    bentoBg: 'bg-[#F59E0B]',
    bannerGradient: 'from-[#FEF3C7] via-[#FFFBEB] to-[#FEF9C3]',
    bannerTagText: 'text-[#B45309]',
    bannerTitleText: 'text-[#92400E]',
    activePillBg: 'bg-amber-600',
    activePillText: 'text-amber-900',
    indicatorColor: 'bg-amber-600',
    accentBadgeBg: 'bg-gray-950',
    accentBadgeText: 'text-[#FDE047]',
  },
  tiffin: {
    primary: '#EA580C', // Warm Orange Coral
    navBg: 'bg-[#FDBA74]',
    bgGradient: 'from-[#FDBA74] via-[#FED7AA] to-[#FFF7ED]',
    bentoBg: 'bg-[#FB923C]',
    bannerGradient: 'from-[#FFEDD5] via-[#FFF7ED] to-[#FFE4E6]',
    bannerTagText: 'text-[#C2410C]',
    bannerTitleText: 'text-[#9A3412]',
    activePillBg: 'bg-orange-600',
    activePillText: 'text-orange-900',
    indicatorColor: 'bg-orange-600',
    accentBadgeBg: 'bg-[#FDE047]',
    accentBadgeText: 'text-black',
  },
};

interface CategoryNavState {
  mobileCategory: MobileCategoryKey;
  setMobileCategory: (category: MobileCategoryKey) => void;
}

export const useCategoryNavStore = create<CategoryNavState>((set) => ({
  mobileCategory: 'all',
  setMobileCategory: (category) => set({ mobileCategory: category }),
}));
