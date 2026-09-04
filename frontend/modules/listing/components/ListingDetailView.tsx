'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Star, Phone, MessageCircle, ShieldCheck, CheckCircle2,
  Wifi, Tv, Wind, Coffee, Car, Lock, Clock, Calendar,
  Share2, Heart, ChevronRight, ChevronLeft, Eye, User, Sparkles, Building,
  Check, ArrowRight, ExternalLink, Bed, KeyRound, Bath, Zap,
  Flame, Utensils, Droplets, ArrowUpDown, Shield, X, Grid
} from 'lucide-react';
import { ListingDetailData } from '../hooks/useListings';
import { HourlyBookingModal } from '@frontend/components/booking/HourlyBookingModal';
import { useAuthStore } from '@frontend/stores/authStore';

function getAmenityIcon(amenity: string) {
  const text = amenity.toLowerCase();
  if (text.includes('wifi') || text.includes('internet')) {
    return <Wifi className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (text.includes('ac') || text.includes('air conditioner') || text.includes('cooling')) {
    return <Wind className="w-4 h-4 text-cyan-600 shrink-0" />;
  }
  if (text.includes('tv') || text.includes('television')) {
    return <Tv className="w-4 h-4 text-indigo-600 shrink-0" />;
  }
  if (text.includes('washroom') || text.includes('bath') || text.includes('toilet') || text.includes('geyser') || text.includes('hot water')) {
    return text.includes('geyser') || text.includes('hot') 
      ? <Flame className="w-4 h-4 text-amber-600 shrink-0" />
      : <Bath className="w-4 h-4 text-teal-600 shrink-0" />;
  }
  if (text.includes('power') || text.includes('generator') || text.includes('backup')) {
    return <Zap className="w-4 h-4 text-yellow-600 shrink-0" />;
  }
  if (text.includes('food') || text.includes('service') || text.includes('kitchen') || text.includes('meal') || text.includes('room service')) {
    return <Utensils className="w-4 h-4 text-orange-600 shrink-0" />;
  }
  if (text.includes('parking') || text.includes('car') || text.includes('bike')) {
    return <Car className="w-4 h-4 text-slate-700 shrink-0" />;
  }
  if (text.includes('housekeeping') || text.includes('clean') || text.includes('sanitized')) {
    return <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />;
  }
  if (text.includes('lift') || text.includes('elevator')) {
    return <ArrowUpDown className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (text.includes('water') || text.includes('ro')) {
    return <Droplets className="w-4 h-4 text-sky-600 shrink-0" />;
  }
  if (text.includes('couple') || text.includes('love') || text.includes('safe')) {
    return <Heart className="w-4 h-4 text-rose-600 shrink-0" />;
  }
  if (text.includes('cctv') || text.includes('security') || text.includes('guard')) {
    return <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />;
  }
  return <Check className="w-4 h-4 text-blue-600 shrink-0" />;
}

const CoupleSafeGuaranteeCard = React.memo(function CoupleSafeGuaranteeCard() {
  return (
    <div className="bg-[#F8FAFD] rounded-[36px] p-6 sm:p-7 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_3px_6px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] space-y-5 transform-gpu">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-[22px] bg-white border-2 border-white shadow-[0_8px_20px_rgba(139,44,226,0.12),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center text-[#8B2CE2] shrink-0">
            <Heart className="w-6 h-6 fill-[#8B2CE2] text-[#8B2CE2]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a] tracking-tight">
              SearchBook Couple Safe & Privacy Guarantee
            </h2>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              100% Legal, Discreet & Verified Stay For Couples
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 text-xs font-black text-[#8B2CE2] bg-white border-2 border-white px-5 py-2.5 rounded-full shadow-[0_6px_16px_rgba(139,44,226,0.12),inset_0_2px_4px_rgba(255,255,255,0.95)]">
          <ShieldCheck className="w-4 h-4 text-[#8B2CE2]" />
          100% Verified Stay
        </span>
      </div>

      {/* 4 True 3D Claymorphic Pill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Lavender Clay (Top Left) */}
        <div className="px-5 py-4.5 rounded-[28px] bg-[#F3EEFA] border-2 border-white shadow-[0_10px_25px_rgba(139,44,226,0.12),inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(139,44,226,0.06)] flex items-center gap-4 hover:scale-[1.01] transition-transform">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#9D44F8] to-[#7916E8] text-white shadow-[0_12px_24px_rgba(139,44,226,0.42),inset_0_3px_4px_rgba(255,255,255,0.45),inset_0_-3px_4px_rgba(0,0,0,0.2)] flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#1F1138] block leading-snug">Unmarried & Married Welcome</strong>
            <p className="text-xs font-medium text-[#6B2FB8] mt-0.5 leading-snug">Zero moral policing, intrusion or awkward judgment.</p>
          </div>
        </div>

        {/* Card 2: Coral / Red Clay (Top Right - NOT PINK) */}
        <div className="px-5 py-4.5 rounded-[28px] bg-[#FDEBE8] border-2 border-white shadow-[0_10px_25px_rgba(229,32,55,0.12),inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(229,32,55,0.06)] flex items-center gap-4 hover:scale-[1.01] transition-transform">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#F03048] to-[#C91028] text-white shadow-[0_12px_24px_rgba(229,32,55,0.42),inset_0_3px_4px_rgba(255,255,255,0.45),inset_0_-3px_4px_rgba(0,0,0,0.2)] flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#381115] block leading-snug">Local & Outstation 18+ IDs</strong>
            <p className="text-xs font-medium text-[#A8202F] mt-0.5 leading-snug">Aadhaar, Voter ID, Driving License & Passport accepted.</p>
          </div>
        </div>

        {/* Card 3: Warm Honey Clay (Bottom Left) */}
        <div className="px-5 py-4.5 rounded-[28px] bg-[#FEF5E3] border-2 border-white shadow-[0_10px_25px_rgba(217,119,6,0.12),inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(217,119,6,0.06)] flex items-center gap-4 hover:scale-[1.01] transition-transform">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#F59E0B] to-[#C96700] text-white shadow-[0_12px_24px_rgba(217,119,6,0.42),inset_0_3px_4px_rgba(255,255,255,0.45),inset_0_-3px_4px_rgba(0,0,0,0.2)] flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#381D02] block leading-snug">Zero Awkward Desk Questions</strong>
            <p className="text-xs font-medium text-[#8C4604] mt-0.5 leading-snug">Staff pre-briefed for discrete 1-minute key handover.</p>
          </div>
        </div>

        {/* Card 4: SearchBook Electric Blue Clay (Bottom Right) */}
        <div className="px-5 py-4.5 rounded-[28px] bg-[#EAF3FD] border-2 border-white shadow-[0_10px_25px_rgba(0,51,204,0.14),inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,51,204,0.06)] flex items-center gap-4 hover:scale-[1.01] transition-transform">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_12px_24px_rgba(0,51,204,0.42),inset_0_3px_4px_rgba(255,255,255,0.45),inset_0_-3px_4px_rgba(0,0,0,0.2)] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#0B1E3B] block leading-snug">Pay at Hotel on Arrival</strong>
            <p className="text-xs font-medium text-[#1853A3] mt-0.5 leading-snug">Zero advance fee. Pay directly via Cash or UPI at desk.</p>
          </div>
        </div>
      </div>
    </div>
  );
});

const PropertySafeGuaranteeCard = React.memo(function PropertySafeGuaranteeCard({ isPG }: { isPG?: boolean }) {
  return (
    <div className="bg-[#F8FAFD] rounded-[36px] p-6 sm:p-7 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_3px_6px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] space-y-5 transform-gpu">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-[22px] bg-white border-2 border-white shadow-[0_8px_20px_rgba(0,51,204,0.12),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center text-[#0033CC] shrink-0">
            <Building className="w-6 h-6 text-[#0033CC]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a] tracking-tight">
              SearchBook Verified Living Space
            </h2>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              100% Direct Owner, Zero Brokerage & Verified Accommodation
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 text-xs font-black text-[#2F6B4F] bg-[#E3ECE6] border-2 border-white px-5 py-2.5 rounded-full shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#2F6B4F]" />
          100% Verified Property
        </span>
      </div>

      {/* 4 True 3D Claymorphic Pill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="px-5 py-4.5 rounded-[28px] bg-[#EAF3FD] border-2 border-white shadow-[0_10px_25px_rgba(0,51,204,0.14),inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,51,204,0.06)] flex items-center gap-4 hover:scale-[1.01] transition-transform">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_12px_24px_rgba(0,51,204,0.42),inset_0_3px_4px_rgba(255,255,255,0.45),inset_0_-3px_4px_rgba(0,0,0,0.2)] flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#0B1E3B] block leading-snug">Zero Brokerage Fee</strong>
            <p className="text-xs font-medium text-[#1853A3] mt-0.5 leading-snug">Connect directly with the verified property owner.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="px-5 py-4.5 rounded-[28px] bg-[#E3ECE6] border-2 border-white shadow-[0_10px_25px_rgba(47,107,79,0.12),inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(47,107,79,0.06)] flex items-center gap-4 hover:scale-[1.01] transition-transform">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#2F6B4F] to-[#1E4D37] text-white shadow-[0_12px_24px_rgba(47,107,79,0.42),inset_0_3px_4px_rgba(255,255,255,0.45),inset_0_-3px_4px_rgba(0,0,0,0.2)] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#112E20] block leading-snug">Direct Site Visit</strong>
            <p className="text-xs font-medium text-[#255C42] mt-0.5 leading-snug">Schedule a free in-person physical inspection.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="px-5 py-4.5 rounded-[28px] bg-[#FEF5E3] border-2 border-white shadow-[0_10px_25px_rgba(217,119,6,0.12),inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(217,119,6,0.06)] flex items-center gap-4 hover:scale-[1.01] transition-transform">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#F59E0B] to-[#C96700] text-white shadow-[0_12px_24px_rgba(217,119,6,0.42),inset_0_3px_4px_rgba(255,255,255,0.45),inset_0_-3px_4px_rgba(0,0,0,0.2)] flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#381D02] block leading-snug">Standard Agreement</strong>
            <p className="text-xs font-medium text-[#8C4604] mt-0.5 leading-snug">Transparent security deposit & rental terms.</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="px-5 py-4.5 rounded-[28px] bg-[#F3EEFA] border-2 border-white shadow-[0_10px_25px_rgba(139,44,226,0.12),inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(139,44,226,0.06)] flex items-center gap-4 hover:scale-[1.01] transition-transform">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#9D44F8] to-[#7916E8] text-white shadow-[0_12px_24px_rgba(139,44,226,0.42),inset_0_3px_4px_rgba(255,255,255,0.45),inset_0_-3px_4px_rgba(0,0,0,0.2)] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#1F1138] block leading-snug">Ready To Move</strong>
            <p className="text-xs font-medium text-[#6B2FB8] mt-0.5 leading-snug">{isPG ? 'Fully furnished with meals & WiFi.' : 'Verified electricity, water supply & fittings.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

interface ListingDetailViewProps {
  listing: ListingDetailData;
}

export function ListingDetailView({ listing }: ListingDetailViewProps) {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleOpenBooking = () => {
    if (!user) {
      openAuthModal('phone-otp');
      return;
    }
    setIsBookingModalOpen(true);
  };
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const REVIEWS_PER_PAGE = 6;
  const reviewsList = listing.reviews || [];
  const totalReviews = reviewsList.length;
  const totalReviewPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE) || 1;
  const paginatedReviews = totalReviews > 0
    ? reviewsList.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE)
    : [
        { id: '1', rating: 5, comment: 'Super discreet check-in. Just showed the booking ID and got key in 10 seconds. Clean room and good AC!', user: { name: 'Aman K.', avatar: null }, createdAt: '2 days ago' },
        { id: '2', rating: 5, comment: 'Completely couple friendly without any awkward questions. Best hourly hotel booking experience.', user: { name: 'Pooja R.', avatar: null }, createdAt: '1 week ago' },
      ];

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'];

  const categorySlug = listing.category?.slug?.toLowerCase() || '';
  const isHotel = categorySlug === 'hourly-hotels' || categorySlug === 'hotels';
  const isFlat = categorySlug === 'flats' || categorySlug === 'flat' || categorySlug === 'house' || categorySlug === 'apartments';
  const isPG = categorySlug === 'pg-hostel' || categorySlug === 'pg' || categorySlug === 'hostel';
  const baseHourlyPrice = listing.price && Number(listing.price) <= 950 ? 199 : Math.max(199, Math.round((Number(listing.price || 899) * 0.23) / 10) * 10 - 1);
  const base24hPrice = Number(listing.price) || 899;

  // Keyboard navigation & body scroll lock for Lightbox Gallery
  useEffect(() => {
    if (!isGalleryOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryOpen(false);
      if (e.key === 'ArrowRight') setActivePhotoIndex((prev) => (prev + 1) % photos.length);
      if (e.key === 'ArrowLeft') setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGalleryOpen, photos.length]);

  return (
    <>
      <main className="min-h-screen bg-[#EFF4FA] pb-24">
        {/* ── BREADCRUMBS ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="bg-[#F8FAFD] hover:bg-white text-gray-700 px-4 py-2 rounded-full border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] font-bold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link href={`/?city=${listing.city.slug}`} className="bg-[#F8FAFD] hover:bg-white text-gray-700 px-4 py-2 rounded-full border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] font-bold transition-colors">
              {listing.city.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link href={`/?category=${listing.category.slug}`} className="bg-[#F8FAFD] hover:bg-white text-gray-700 px-4 py-2 rounded-full border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] font-bold transition-colors">
              {listing.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-[#0f172a] font-extrabold px-4 py-2 bg-[#F8FAFD] rounded-full border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] truncate max-w-[240px] sm:max-w-none">
              {listing.title}
            </span>
          </nav>
        </div>

        {/* ── TITLE & TOP BAR ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-[#E1EDF6] text-[#0033CC] px-4 py-1.5 rounded-full border-2 border-white shadow-xs">
                  {listing.category.name}
                </span>
                {listing.isVerified && (
                  <span className="text-xs font-black bg-[#E3ECE6] text-[#2F6B4F] px-4 py-1.5 rounded-full border-2 border-white shadow-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B4F]" />
                    SearchBook Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f172a] mt-2.5 tracking-tight">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 mt-2">
                <span className="flex items-center gap-1.5 font-black text-[#0f172a] bg-[#F8FAFD] px-4 py-1.5 rounded-full border-2 border-white shadow-xs">
                  <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                  4.8
                  <span className="text-gray-400 font-normal">({listing._count?.reviews || 24} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5 text-gray-700 font-semibold bg-[#F8FAFD] px-4 py-1.5 rounded-full border-2 border-white shadow-xs">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {listing.address}, {listing.city.name}
                </span>
              </div>
            </div>

            {/* Quick Share 3D Clay Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: listing.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="px-5 py-3 text-xs font-black text-gray-800 bg-[#F8FAFD] hover:bg-white border-2 border-white shadow-[0_6px_16px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.95)] rounded-[20px] flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
              >
                <Share2 className="w-4 h-4 text-gray-700" />
                <span>Share Stay</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── HIGH-RES HERO PHOTO GALLERY GRID (3D CLAY FRAME) ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-9">
          <div className="relative rounded-[36px] overflow-hidden bg-gray-900 border-4 border-white shadow-[0_20px_45px_rgba(30,70,120,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 max-h-[480px]">
              {/* Big Main Image (Left 2 Columns) */}
              <div
                className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-[460px] cursor-pointer group overflow-hidden bg-gray-900"
                onClick={() => {
                  setActivePhotoIndex(0);
                  setIsGalleryOpen(true);
                }}
              >
                <img
                  src={photos[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Right 2 Columns (4 Thumbnails Grid) */}
              <div className="hidden md:grid col-span-2 grid-cols-2 gap-2.5 h-[460px]">
                {[1, 2, 3, 4].map((idx) => {
                  const photoUrl = photos[idx] || photos[0];
                  return (
                    <div
                      key={idx}
                      className="relative h-[225px] cursor-pointer group overflow-hidden bg-gray-900"
                      onClick={() => {
                        setActivePhotoIndex(idx < photos.length ? idx : 0);
                        setIsGalleryOpen(true);
                      }}
                    >
                      <img
                        src={photoUrl}
                        alt={`${listing.title} photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      {idx === 4 && photos.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 hover:bg-black/70 flex flex-col items-center justify-center text-white font-bold text-sm transition-colors">
                          <Grid className="w-5 h-5 mb-1 text-white" />
                          <span>+{photos.length - 4} More Photos</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Floating 3D "View All Photos" Button */}
            <button
              type="button"
              onClick={() => {
                setActivePhotoIndex(0);
                setIsGalleryOpen(true);
              }}
              className="absolute bottom-5 right-5 bg-white/95 hover:bg-white text-[#0f172a] text-xs font-black px-5 py-3 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_2px_3px_rgba(255,255,255,0.9)] border-2 border-white flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md hover:scale-105"
            >
              <Grid className="w-4 h-4 text-[#0033CC]" />
              <span>Show All {photos.length} Photos</span>
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT & STICKY BOOKING SIDEBAR ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ── LEFT COLUMN (DETAILS & HIGHLIGHTS) ── */}
            <div className="lg:col-span-2 space-y-7">
              
              {/* 1. GUARANTEE CARD */}
              {isHotel ? (
                <CoupleSafeGuaranteeCard />
              ) : (
                <PropertySafeGuaranteeCard isPG={isPG} />
              )}

              {/* 2. PROPERTY / ROOM SPECIFICATIONS */}
              <div className="bg-[#F8FAFD] rounded-[36px] p-6 sm:p-7 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] space-y-5">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0f172a]">
                      {isHotel ? 'Room Setup & Specifications' : isFlat ? 'Flat Specifications' : isPG ? 'PG & Hostel Setup' : 'Specifications'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Verified property details & amenities</p>
                  </div>
                  <span className="text-xs font-black text-[#2F6B4F] bg-[#E3ECE6] px-3.5 py-1.5 rounded-full border border-[#C5DDD0] shadow-2xs">
                    ● Active Listing
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {isHotel ? (
                    <>
                      {/* Bed Setup */}
                      <div className="p-4 rounded-[26px] bg-[#F0F5FB] border-2 border-white shadow-[0_10px_22px_rgba(30,70,120,0.1),inset_0_3px_5px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center mb-2">
                          <Bed className="w-6 h-6 fill-white text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#2B6CB0] block uppercase font-black tracking-wider">Bed Setup</span>
                          <strong className="text-xs sm:text-sm font-black text-[#0B1E3B] block truncate capitalize">
                            {listing.furnishing ? listing.furnishing.replace(/_/g, ' ').toLowerCase() : '1 King Double'}
                          </strong>
                          <span className="text-[10px] font-bold text-[#1853A3] block mt-0.5">Sanitized Linens</span>
                        </div>
                      </div>

                      {/* Room Type */}
                      <div className="p-4 rounded-[26px] bg-[#F0F5FB] border-2 border-white shadow-[0_10px_22px_rgba(30,70,120,0.1),inset_0_3px_5px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center mb-2">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#2B6CB0] block uppercase font-black tracking-wider">Room Type</span>
                          <strong className="text-xs sm:text-sm font-black text-[#0B1E3B] block truncate capitalize">
                            {listing.tenantType ? listing.tenantType.replace(/_/g, ' ').toLowerCase() : (listing.bhkType ? listing.bhkType.replace(/_/g, ' ') : 'Deluxe AC')}
                          </strong>
                          <span className="text-[10px] font-bold text-[#1853A3] block mt-0.5">Air Conditioned</span>
                        </div>
                      </div>

                      {/* Occupancy */}
                      <div className="p-4 rounded-[26px] bg-[#F0F5FB] border-2 border-white shadow-[0_10px_22px_rgba(30,70,120,0.1),inset_0_3px_5px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center mb-2">
                          <User className="w-6 h-6 fill-white text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#2B6CB0] block uppercase font-black tracking-wider">Occupancy</span>
                          <strong className="text-xs sm:text-sm font-black text-[#0B1E3B] block truncate">
                            Max 2-3 Guests
                          </strong>
                          <span className="text-[10px] font-bold text-[#1853A3] block mt-0.5">Couples Welcomed</span>
                        </div>
                      </div>

                      {/* Timing */}
                      <div className="p-4 rounded-[26px] bg-[#F0F5FB] border-2 border-white shadow-[0_10px_22px_rgba(30,70,120,0.1),inset_0_3px_5px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center mb-2">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#2B6CB0] block uppercase font-black tracking-wider">Operating</span>
                          <strong className="text-[11px] sm:text-xs font-black text-[#0B1E3B] block leading-tight">
                            {listing.openingTime && listing.closingTime ? `${listing.openingTime} – ${listing.closingTime}` : '24/7 Check-in'}
                          </strong>
                          <span className="text-[10px] font-bold text-[#1853A3] block mt-0.5">Flexible Timing</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* BHK / Room Config */}
                      <div className="p-4 rounded-[26px] bg-[#F0F5FB] border-2 border-white shadow-[0_10px_22px_rgba(30,70,120,0.1),inset_0_3px_5px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center mb-2">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#2B6CB0] block uppercase font-black tracking-wider">Config</span>
                          <strong className="text-xs sm:text-sm font-black text-[#0B1E3B] block truncate">
                            {listing.bhkType ? listing.bhkType.replace(/_/g, ' ') : isFlat ? '1-2 BHK' : isPG ? 'Sharing Rooms' : 'Residential'}
                          </strong>
                          <span className="text-[10px] font-bold text-[#1853A3] block mt-0.5">Spacious</span>
                        </div>
                      </div>

                      {/* Furnishing */}
                      <div className="p-4 rounded-[26px] bg-[#F0F5FB] border-2 border-white shadow-[0_10px_22px_rgba(30,70,120,0.1),inset_0_3px_5px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center mb-2">
                          <Bed className="w-6 h-6 fill-white text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#2B6CB0] block uppercase font-black tracking-wider">Furnishing</span>
                          <strong className="text-xs sm:text-sm font-black text-[#0B1E3B] block truncate capitalize">
                            {listing.furnishing ? listing.furnishing.replace(/_/g, ' ').toLowerCase() : 'Semi-Furnished'}
                          </strong>
                          <span className="text-[10px] font-bold text-[#1853A3] block mt-0.5">Ready to Move</span>
                        </div>
                      </div>

                      {/* Suitable / Available For */}
                      <div className="p-4 rounded-[26px] bg-[#F0F5FB] border-2 border-white shadow-[0_10px_22px_rgba(30,70,120,0.1),inset_0_3px_5px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center mb-2">
                          <User className="w-6 h-6 fill-white text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#2B6CB0] block uppercase font-black tracking-wider">Available For</span>
                          <strong className="text-xs sm:text-sm font-black text-[#0B1E3B] block truncate capitalize">
                            {listing.tenantType ? listing.tenantType.replace(/_/g, ' ').toLowerCase() : 'All Welcome'}
                          </strong>
                          <span className="text-[10px] font-bold text-[#1853A3] block mt-0.5">Direct Owner</span>
                        </div>
                      </div>

                      {/* Zero Brokerage (Replaces irrelevant opening/closing hours for flats) */}
                      <div className="p-4 rounded-[26px] bg-[#F0F5FB] border-2 border-white shadow-[0_10px_22px_rgba(30,70,120,0.1),inset_0_3px_5px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,30,80,0.03)] flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#2F6B4F] to-[#1E4D37] text-white shadow-[0_8px_18px_rgba(47,107,79,0.32),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center mb-2">
                          <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#2F6B4F] block uppercase font-black tracking-wider">Brokerage</span>
                          <strong className="text-xs sm:text-sm font-black text-[#0B1E3B] block truncate">
                            ₹0 (Zero Fee)
                          </strong>
                          <span className="text-[10px] font-bold text-[#2F6B4F] block mt-0.5">100% Direct Deal</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3. ABOUT THE PROPERTY / DESCRIPTION */}
              <div className="bg-[#F8FAFD] rounded-[36px] p-6 sm:p-7 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] space-y-4">
                <h3 className="text-base sm:text-lg font-black text-[#0f172a]">
                  About this {isHotel ? 'Hotel Stay' : isFlat ? 'Flat & Residence' : isPG ? 'PG & Hostel' : (listing.category?.name || 'Property')}
                </h3>
                {(() => {
                  const desc = listing.description || (
                    isHotel
                      ? `${listing.title} is a premium, couple-friendly hotel located in the heart of ${listing.city.name}. Designed for travellers and couples seeking short micro-stays, day stays, or full 24-hour comfortable accommodation with sanitized rooms, high-speed WiFi, and 24/7 front desk assistance.`
                      : isPG
                      ? `${listing.title} is a verified PG & hostel accommodation located in ${listing.address}, ${listing.city.name}. Offering comfortable student and bachelor accommodation with clean rooms, essential amenities, and direct owner management.`
                      : `${listing.title} is a verified residential rental property located at ${listing.address}, ${listing.city.name}. Connect directly with the verified owner with zero brokerage and explore transparent terms.`
                  );
                  const isLong = desc.length > 220;
                  const displayDesc = (!isDescriptionExpanded && isLong) ? `${desc.slice(0, 220)}...` : desc;

                  return (
                    <div className="bg-white rounded-[26px] p-5 border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] space-y-3">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line font-normal">
                        {displayDesc}
                      </p>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="px-4 py-2 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#0033CC] to-[#2563EB] shadow-[0_4px_12px_rgba(0,51,204,0.3)] inline-flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                        >
                          {isDescriptionExpanded ? 'Show Less ↑' : 'Read More →'}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* 4. AVAILABLE AMENITIES GRID */}
              <div className="bg-[#F8FAFD] rounded-[36px] p-6 sm:p-7 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] space-y-5">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0f172a]">Available Amenities</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Complimentary features & fittings</p>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {((listing.amenities && listing.amenities.length > 0) ? listing.amenities.length : 6)} Features Included
                  </span>
                </div>

                {(() => {
                  const allAmenities = (listing.amenities && listing.amenities.length > 0)
                    ? listing.amenities
                    : isHotel
                    ? [
                        'Free High-Speed WiFi', 'Air Conditioning', 'Flat-screen Smart TV',
                        'Attached Private Bathroom', '24/7 Hot Water / Geyser', 'Power Backup',
                        'Daily Housekeeping', 'Free Parking Space', '24/7 Room Service'
                      ]
                    : [
                        '24/7 Water Supply', 'Electricity & Power Backup', 'Dedicated Parking Space',
                        'Gated Security & CCTV', 'Attached Washroom', 'Modular Kitchen Fittings'
                      ];
                  const displayedAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 9);
                  const remainingCount = allAmenities.length - 9;

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                        {displayedAmenities.map((amenity, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3.5 bg-white hover:bg-[#F0F5FA] rounded-[24px] border-2 border-white text-xs font-bold text-[#0f172a] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] group hover:scale-[1.02]"
                          >
                            <div className="w-10 h-10 rounded-[14px] bg-[#EAF3FD] border border-[#CCE1FD] shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              {getAmenityIcon(amenity)}
                            </div>
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>

                      {allAmenities.length > 9 && (
                        <button
                          type="button"
                          onClick={() => setShowAllAmenities(!showAllAmenities)}
                          className="w-full py-4 px-5 text-xs font-black text-[#0033CC] bg-white hover:bg-blue-50 border-2 border-white rounded-[24px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_6px_16px_rgba(0,51,204,0.08),inset_0_2px_3px_rgba(255,255,255,0.95)] hover:scale-[1.01] mt-2"
                        >
                          {showAllAmenities ? (
                            <span>Show Less Amenities</span>
                          ) : (
                            <span>See More (+{remainingCount} Amenities)</span>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* 5. POLICIES & GUIDELINES */}
              <div className="bg-[#F8FAFD] rounded-[36px] p-6 sm:p-7 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] space-y-4">
                <h3 className="text-base sm:text-lg font-black text-[#0f172a]">
                  {isHotel ? 'Stay Policies & Guidelines' : 'Rental Guidelines & Terms'}
                </h3>
                {isHotel ? (
                  <ul className="space-y-3 text-xs text-gray-700">
                    <li className="flex items-start gap-3.5 p-4 rounded-[24px] bg-[#EAF3FD] border-2 border-white shadow-2xs">
                      <div className="w-9 h-9 rounded-2xl bg-[#0033CC] text-white shadow-[0_4px_10px_rgba(0,51,204,0.3)] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="mt-1 font-medium"><strong>Check-in Requirement:</strong> Valid 18+ Govt ID (Aadhaar Card, Driving License, Voter ID or Passport) is required for all adult guests.</span>
                    </li>
                    <li className="flex items-start gap-3.5 p-4 rounded-[24px] bg-[#F3EEFA] border-2 border-white shadow-2xs">
                      <div className="w-9 h-9 rounded-2xl bg-[#9D44F8] text-white shadow-[0_4px_10px_rgba(157,68,248,0.3)] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="mt-1 font-medium"><strong>Couples Policy:</strong> Unmarried and married couples are warmly welcome. Local city IDs are accepted with zero discrimination.</span>
                    </li>
                    <li className="flex items-start gap-3.5 p-4 rounded-[24px] bg-[#FEF5E3] border-2 border-white shadow-2xs">
                      <div className="w-9 h-9 rounded-2xl bg-[#F59E0B] text-white shadow-[0_4px_10px_rgba(245,158,11,0.3)] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="mt-1 font-medium"><strong>Payment Policy:</strong> Pay on arrival at hotel reception desk. No advance payment required on SearchBook.</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-3 text-xs text-gray-700">
                    <li className="flex items-start gap-3.5 p-4 rounded-[24px] bg-[#EAF3FD] border-2 border-white shadow-2xs">
                      <div className="w-9 h-9 rounded-2xl bg-[#0033CC] text-white shadow-[0_4px_10px_rgba(0,51,204,0.3)] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="mt-1 font-medium"><strong>Direct Owner Connect:</strong> 100% Zero brokerage. Deal directly with the verified property owner for site visits and negotiations.</span>
                    </li>
                    <li className="flex items-start gap-3.5 p-4 rounded-[24px] bg-[#E3ECE6] border-2 border-white shadow-2xs">
                      <div className="w-9 h-9 rounded-2xl bg-[#2F6B4F] text-white shadow-[0_4px_10px_rgba(47,107,79,0.3)] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="mt-1 font-medium"><strong>Tenant KYC:</strong> Valid Govt ID (Aadhaar / Voter ID / Employment ID) required for standard rental agreement.</span>
                    </li>
                    <li className="flex items-start gap-3.5 p-4 rounded-[24px] bg-[#FEF5E3] border-2 border-white shadow-2xs">
                      <div className="w-9 h-9 rounded-2xl bg-[#F59E0B] text-white shadow-[0_4px_10px_rgba(245,158,11,0.3)] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="mt-1 font-medium"><strong>Deposit & Advance Terms:</strong> 100% transparent security deposit as agreed mutually between tenant and owner.</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* 6. LOCATION & INTERACTIVE GOOGLE MAP */}
              <div className="bg-[#F8FAFD] rounded-[36px] p-6 sm:p-7 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0f172a]">Location & Surroundings</h3>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{listing.address}, {listing.city.name}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.title} ${listing.address} ${listing.city.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-black text-white bg-[#0033CC] hover:bg-[#0028A3] rounded-full flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(0,51,204,0.3)] shrink-0 hover:scale-105"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="relative w-full h-64 sm:h-72 rounded-[28px] overflow-hidden border-2 border-white shadow-md bg-gray-100 transform-gpu contain-paint">
                  <iframe
                    title={`${listing.title} Google Map Location`}
                    src={`https://maps.google.com/maps?q=${listing.latitude && listing.longitude ? `${listing.latitude},${listing.longitude}` : encodeURIComponent(`${listing.title}, ${listing.address}, ${listing.city.name}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                  
                  <div className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white text-xs flex items-center gap-2.5 max-w-[85%]">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                    <div className="min-w-0">
                      <span className="font-black text-gray-900 block truncate">{listing.title}</span>
                      <span className="text-[10px] text-gray-500 font-medium block truncate">{listing.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. VERIFIED GUEST REVIEWS */}
              <div className="bg-[#F8FAFD] rounded-[36px] p-6 sm:p-7 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] space-y-5">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0f172a]">User Reviews & Ratings</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                      {totalReviews > 0 ? `${totalReviews} verified reviews` : 'Recent user feedback'}
                    </p>
                  </div>
                  <span className="text-xs font-black text-[#0f172a] flex items-center gap-1.5 bg-[#FEF5E3] border border-[#FDE5C3] px-4 py-1.5 rounded-full shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                    4.8 / 5.0
                  </span>
                </div>

                <div className="space-y-3.5">
                  {paginatedReviews.map((rev, i) => (
                    <div key={i} className="p-4 sm:p-5 bg-white rounded-[26px] border-2 border-[#F0F5FA] text-xs space-y-2 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[12px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white shadow-[0_4px_10px_rgba(0,51,204,0.3)] flex items-center justify-center font-black text-[11px]">
                            {rev.user?.name?.[0] || 'G'}
                          </div>
                          <span className="font-black text-gray-900">{rev.user?.name || 'Verified User'}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating || 5 }).map((_, rIdx) => (
                            <Star key={rIdx} className="w-3.5 h-3.5 fill-[#FFB800]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 pt-0.5 leading-relaxed font-normal">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>

                {totalReviews > 6 && (
                  <div className="flex items-center justify-between pt-3.5 border-t border-[#E2E8F0] text-xs">
                    <button
                      type="button"
                      disabled={reviewPage === 1}
                      onClick={() => setReviewPage((prev) => Math.max(1, prev - 1))}
                      className="px-4 py-2 font-black text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 rounded-full transition-all cursor-pointer disabled:cursor-not-allowed border border-gray-200 shadow-2xs"
                    >
                      ← Previous
                    </button>

                    <span className="font-bold text-gray-500">
                      Page <strong className="text-gray-900">{reviewPage}</strong> of <strong className="text-gray-900">{totalReviewPages}</strong>
                    </span>

                    <button
                      type="button"
                      disabled={reviewPage === totalReviewPages}
                      onClick={() => setReviewPage((prev) => Math.min(totalReviewPages, prev + 1))}
                      className="px-4 py-2 font-black text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 rounded-full transition-all cursor-pointer disabled:cursor-not-allowed border border-gray-200 shadow-2xs"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN (STICKY BOOKING WIDGET - 3D CLAY TABLET) ── */}
            <div className="lg:col-span-1 lg:sticky lg:top-20 z-30 space-y-4 self-start">
              <div className="bg-[#F8FAFD] rounded-[32px] p-5 sm:p-6 border-2 border-white shadow-[0_18px_40px_rgba(30,70,120,0.12),inset_0_2px_4px_rgba(255,255,255,0.95)] space-y-4">
                
                {isHotel ? (
                  <>
                    {/* Hotel Starting Price Box */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#002B99] via-[#0033CC] to-[#1D4ED8] p-4.5 rounded-[24px] border-2 border-white shadow-[0_12px_28px_rgba(0,51,204,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)] text-white">
                      <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                          <span className="text-[10px] text-white/85 font-black uppercase tracking-wider">Starting Price</span>
                        </div>
                        <span className="text-[10px] font-black text-black bg-[#CCFF00] px-2.5 py-0.5 rounded-full shadow-xs">
                          Pay at Hotel
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5 mt-1 relative z-10">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          ₹{baseHourlyPrice}
                        </span>
                        <span className="text-xs text-white/85 font-bold">
                          / 2 Hours Micro-Stay
                        </span>
                      </div>
                    </div>

                    {/* Stay Duration Packages Breakdown */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-[#0f172a] uppercase tracking-wider block">
                          Stay Duration Packages
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">5 Options Available</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* 2 Hours */}
                        <div className="p-2.5 bg-[#EAF3FD] border-2 border-white rounded-[18px] shadow-2xs text-center">
                          <span className="text-[9px] text-[#0033CC] block font-black uppercase">2 Hours</span>
                          <span className="text-xs font-black text-[#0B1E3B] block mt-0.5">₹{baseHourlyPrice}</span>
                          <span className="text-[8px] text-gray-500 font-medium block">Micro-Stay</span>
                        </div>

                        {/* 3 Hours */}
                        <div className="p-2.5 bg-[#F3EEFA] border-2 border-white rounded-[18px] shadow-2xs text-center">
                          <span className="text-[9px] text-[#9D44F8] block font-black uppercase">3 Hours</span>
                          <span className="text-xs font-black text-[#1F1138] block mt-0.5">₹{Math.round(baseHourlyPrice * 1.5)}</span>
                          <span className="text-[8px] text-purple-700 font-bold block">Popular</span>
                        </div>

                        {/* 6 Hours */}
                        <div className="p-2.5 bg-[#FEF5E3] border-2 border-white rounded-[18px] shadow-2xs text-center">
                          <span className="text-[9px] text-[#D97706] block font-black uppercase">6 Hours</span>
                          <span className="text-xs font-black text-[#381D02] block mt-0.5">₹{Math.max(499, Math.round(baseHourlyPrice * 2.3))}</span>
                          <span className="text-[8px] text-amber-800 font-medium block">Half Day</span>
                        </div>

                        {/* Day Pass */}
                        <div className="p-2.5 bg-[#FEF2D6] border-2 border-white rounded-[18px] shadow-2xs text-center">
                          <span className="text-[9px] text-[#DDA15E] block font-black uppercase">Day Pass</span>
                          <span className="text-xs font-black text-[#422B0C] block mt-0.5">₹599</span>
                          <span className="text-[8px] text-gray-500 font-medium block">9 AM–6 PM</span>
                        </div>

                        {/* Full 24 Hours Stay */}
                        <div className="col-span-2 p-2.5 bg-[#E3ECE6] border-2 border-white rounded-[18px] shadow-2xs flex items-center justify-between px-3.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] text-[#2F6B4F] font-black uppercase">Full 24h Stay</span>
                              <span className="text-[8px] font-black text-[#2F6B4F] bg-white px-1.5 py-0.2 rounded border border-[#C5DDD0]">Flexible</span>
                            </div>
                            <span className="text-[9px] text-[#2F6B4F] font-bold block">24h from check-in</span>
                          </div>
                          <span className="text-sm font-black text-[#1E3A2B]">₹{base24hPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Primary CTA: Book Hourly */}
                    <button
                      type="button"
                      onClick={handleOpenBooking}
                      className="w-full bg-gradient-to-r from-[#0033CC] via-[#1A56DB] to-[#2563EB] hover:from-[#0029A3] hover:to-[#1D4ED8] text-white font-black text-xs sm:text-sm py-3.5 rounded-[20px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_12px_26px_rgba(0,51,204,0.38),inset_0_2px_4px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Book Hourly / Daily Stay</span>
                      <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                    </button>

                    {/* Direct Contact: Call Reception Only */}
                    <div className="pt-1 border-t border-[#E2E8F0]">
                      <a
                        href={`tel:${listing.contactPhone}`}
                        className="w-full px-4 py-3 text-xs font-black text-gray-800 bg-white hover:bg-gray-50 border-2 border-white shadow-2xs rounded-[18px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      >
                        <Phone className="w-3.5 h-3.5 text-gray-700" />
                        <span>Call Hotel Reception</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Flat & PG Price Box (Optional Money Supported!) */}
                    {listing.price && Number(listing.price) > 0 ? (
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#002B99] via-[#0033CC] to-[#1D4ED8] p-4.5 rounded-[24px] border-2 border-white shadow-[0_12px_28px_rgba(0,51,204,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)] text-white">
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />

                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                            <span className="text-[10px] text-white/85 font-black uppercase tracking-wider">
                              {listing.priceType === 'PER_MONTH' ? 'Monthly Rent' : 'Expected Rent'}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-black bg-[#CCFF00] px-2.5 py-0.5 rounded-full shadow-xs">
                            Zero Brokerage
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1.5 mt-1 relative z-10">
                          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            ₹{Number(listing.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-white/85 font-bold">
                            {listing.priceType === 'PER_MONTH' ? '/ month' : listing.priceType === 'ONE_TIME' ? 'visiting fee' : ''}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4.5 rounded-[24px] border-2 border-white shadow-[0_12px_28px_rgba(15,23,42,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)] text-white">
                        <div className="flex items-center justify-between relative z-10">
                          <span className="text-[10px] text-white/85 font-black uppercase tracking-wider">Pricing</span>
                          <span className="text-[10px] font-black text-black bg-[#CCFF00] px-2.5 py-0.5 rounded-full shadow-xs">
                            Direct Owner
                          </span>
                        </div>
                        <div className="mt-1 relative z-10">
                          <span className="text-2xl font-black text-white tracking-tight">
                            Price on Request
                          </span>
                          <p className="text-[11px] text-gray-300 font-medium mt-0.5">
                            Contact owner directly for rent negotiation & details
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Flat / PG Property Details Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {listing.bhkType && (
                        <div className="p-3 rounded-[18px] bg-[#EAF3FD] border-2 border-white text-center shadow-2xs">
                          <span className="text-[9px] text-[#0033CC] font-black uppercase block">Type</span>
                          <span className="text-xs font-black text-[#0B1E3B] block mt-0.5">{listing.bhkType.replace(/_/g, ' ')}</span>
                        </div>
                      )}
                      {listing.furnishing && (
                        <div className="p-3 rounded-[18px] bg-[#F3EEFA] border-2 border-white text-center shadow-2xs">
                          <span className="text-[9px] text-[#9D44F8] font-black uppercase block">Furnishing</span>
                          <span className="text-xs font-black text-[#1F1138] block mt-0.5 capitalize">{listing.furnishing.replace(/_/g, ' ').toLowerCase()}</span>
                        </div>
                      )}
                      {listing.tenantType && (
                        <div className="p-3 rounded-[18px] bg-[#FEF5E3] border-2 border-white text-center shadow-2xs">
                          <span className="text-[9px] text-[#D97706] font-black uppercase block">Available For</span>
                          <span className="text-xs font-black text-[#381D02] block mt-0.5 capitalize">{listing.tenantType.replace(/_/g, ' ').toLowerCase()}</span>
                        </div>
                      )}
                      <div className="p-3 rounded-[18px] bg-[#E3ECE6] border-2 border-white text-center shadow-2xs">
                        <span className="text-[9px] text-[#2F6B4F] font-black uppercase block">Brokerage</span>
                        <span className="text-xs font-black text-[#112E20] block mt-0.5">₹0 (Zero)</span>
                      </div>
                    </div>

                    {/* Flat / PG Direct Action Buttons (Call + WhatsApp ONLY) */}
                    <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                      <a
                        href={`https://wa.me/91${(listing.contactWhatsApp || listing.contactPhone).replace(/\D/g, '')}?text=Hi,%20I%20am%20interested%20in%20your%20property%20${encodeURIComponent(listing.title)}%20on%20SearchBook`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-xs sm:text-sm py-3.5 rounded-[20px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                        <span>Chat on WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${listing.contactPhone}`}
                        className="w-full bg-gradient-to-r from-[#0033CC] to-[#2563EB] hover:from-[#0029A3] hover:to-[#1D4ED8] text-white font-black text-xs sm:text-sm py-3.5 rounded-[20px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_24px_rgba(0,51,204,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Property Owner</span>
                      </a>
                    </div>
                  </>
                )}

                {/* Guarantee Banner */}
                <div className="bg-[#E3ECE6] border-2 border-white rounded-[20px] p-3 flex items-center gap-2.5 text-[#1E3A2B] shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                  <span className="text-[11px] font-black leading-tight">
                    {isHotel ? 'Zero Advance Fee · Pay directly at reception on arrival' : '100% Zero Brokerage · Direct Key Handover & Agreement'}
                  </span>
                </div>

                {/* Host Info */}
                <div className="bg-white rounded-[20px] p-3 border-2 border-white shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[14px] bg-gradient-to-b from-[#0033CC] to-[#2563EB] text-white flex items-center justify-center font-black text-sm shadow-[0_4px_10px_rgba(0,51,204,0.3)] shrink-0">
                    {listing.user?.name?.[0] || 'O'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">
                      {isHotel ? 'Listed By Property' : 'Listed By Owner'}
                    </span>
                    <span className="text-xs font-black text-gray-900 truncate block">{listing.user?.name || 'Verified Host'}</span>
                    <span className="text-[10px] text-[#2F6B4F] font-bold block">● Verified Host</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── MOBILE STICKY BOTTOM STARTING PRICE & CTA BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] md:hidden flex items-center justify-between gap-3">
        {/* Left Side: Starting Price / Rent & Tag */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0033CC] animate-pulse" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
              {isHotel ? 'Starting From' : (listing.price && Number(listing.price) > 0) ? 'Monthly Rent' : 'Pricing'}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#0f172a] tracking-tight">
              {isHotel
                ? `₹${baseHourlyPrice}`
                : (listing.price && Number(listing.price) > 0)
                ? `₹${Number(listing.price).toLocaleString('en-IN')}`
                : 'On Request'}
            </span>
            <span className="text-[11px] font-bold text-gray-500">
              {isHotel
                ? '/ 2 Hours'
                : (listing.price && Number(listing.price) > 0 && listing.priceType === 'PER_MONTH')
                ? '/ mo'
                : ''}
            </span>
          </div>
          <span className="text-[9px] font-bold text-[#2F6B4F] block truncate">
            {isHotel ? '● Pay at Desk · Free Cancel' : '● Zero Brokerage · Direct Owner'}
          </span>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${listing.contactPhone}`}
            className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-all border border-gray-200 shadow-2xs"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </a>

          {isHotel ? (
            <button
              type="button"
              onClick={handleOpenBooking}
              className="bg-gradient-to-r from-[#0033CC] to-[#2563EB] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(0,51,204,0.35)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>Book Hourly</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          ) : (
            <a
              href={`https://wa.me/91${(listing.contactWhatsApp || listing.contactPhone).replace(/\D/g, '')}?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(listing.title)}%20on%20SearchBook`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(37,211,102,0.35)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      {/* ── HOURLY BOOKING MODAL TRIGGER ── */}
      <HourlyBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        listing={{
          id: listing.id,
          title: listing.title,
          address: listing.address,
          price: listing.price,
          priceType: listing.priceType,
          photos: listing.photos,
          openingTime: listing.openingTime,
          closingTime: listing.closingTime,
        }}
      />

      {/* ── FULL-SCREEN AIRBNB-STYLE PHOTO LIGHTBOX MODAL ── */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white shrink-0 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-300 bg-white/10 px-3 py-1 rounded-full font-mono">
                {activePhotoIndex + 1} / {photos.length}
              </span>
              <span className="text-sm font-extrabold text-white truncate max-w-md hidden sm:inline">
                {listing.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsGalleryOpen(false)}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Gallery (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Showcase Image Area */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Previous Button */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-xl hover:scale-110"
                title="Previous Photo (← Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Active Image */}
            <div className="max-w-5xl max-h-[72vh] w-full h-full flex items-center justify-center">
              <img
                src={photos[activePhotoIndex]}
                alt={`${listing.title} photo ${activePhotoIndex + 1}`}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next Button */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => setActivePhotoIndex((prev) => (prev + 1) % photos.length)}
                className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-xl hover:scale-110"
                title="Next Photo (→ Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          {photos.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 shrink-0 max-w-4xl mx-auto px-4">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activePhotoIndex === idx
                      ? 'border-blue-500 scale-105 shadow-lg ring-2 ring-blue-400/50 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img
                    src={p}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
