/**
 * ═══════════════════════════════════════════════════════════
 * 🃏 LISTING CARD — Individual listing display card
 * ═══════════════════════════════════════════════════════════
 *
 * 📱 Mobile Layout:
 *   - Clay card effect (soft shadow, no blur)
 *   - Compact padding (p-3)
 *   - Solid badge backgrounds (no backdrop-blur)
 *   - Smaller text sizes
 *
 * 🖥️ Desktop Layout:
 *   - Standard shadow with hover effects
 *   - Regular padding (p-4)
 *   - Backdrop-blur on badges
 *   - Hover scale animations
 *
 * Performance:
 *   - Badges use solid bg on mobile (no GPU blur)
 *   - Image lazy loaded with fallback
 * ═══════════════════════════════════════════════════════════
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, Phone, MessageCircle, CalendarCheck, Clock } from 'lucide-react';
import { HourlyBookingModal } from '@frontend/components/booking/HourlyBookingModal';
import { useAuthStore } from '@frontend/stores/authStore';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    slug: string;
    price: string | number | null;
    priceType: string | null;
    photos: string[];
    city: { id: string; name: string; slug: string };
    category: { id: string; name: string; slug: string; icon: string | null };
    contactPhone?: string;
    contactWhatsApp?: string | null;
    _count?: { reviews: number };
  };
  fallbackImage?: string;
}

export function ListingCard({ listing, fallbackImage }: ListingCardProps) {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleOpenBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal('phone-otp');
      return;
    }
    setIsBookingOpen(true);
  };
  const defaultFallback = fallbackImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80';
  const [imageSrc, setImageSrc] = useState(listing.photos?.[0] || defaultFallback);
  const isHotel = listing.category?.slug === 'hourly-hotels' || listing.category?.slug === 'hotels';

  const cleanPhone = listing.contactPhone?.replace(/\D/g, '') || '9876543210';
  const cleanWhatsApp = (listing.contactWhatsApp || listing.contactPhone)?.replace(/\D/g, '') || '9876543210';

  return (
    <>
      <article className="group flex flex-col rounded-[1.5rem] bg-white overflow-hidden liquid-glass-droplet md:clay-card md:hover:shadow-xl md:hover:-translate-y-1 transition-all duration-300 relative border-2 border-white/90">
        
        {/* Clickable Area for Image and Details */}
        <Link 
          href={`/${listing.city?.slug || 'city'}/${listing.category?.slug || 'hotels'}/${listing.slug}`} 
          prefetch={true}
          className="flex flex-col flex-1"
        >
          {/* Nested Liquid Image Container */}
          <div className="p-2 pb-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xs">
              {/* Main Image */}
              <img
                src={imageSrc}
                alt={listing.title}
                loading="lazy"
                onError={() => setImageSrc(defaultFallback)}
                className="relative z-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Top Left Badge — Liquid Glass Pill */}
              <div className="absolute top-2.5 left-2.5 liquid-glass-pill text-[#0033CC] text-[10px] md:text-[11px] font-black px-2.5 py-0.5 shadow-xs">
                {listing.category?.name || 'Listing'}
              </div>
              
              {/* Top Right Badge — Liquid Frosted Glass Rating */}
              <div className="absolute top-2.5 right-2.5 liquid-glass bg-black/60 text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-xs border border-white/20">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-[#FFB800] text-[#FFB800]" /> 
                4.8
              </div>

              {/* Pay at Hotel Banner for Hotels */}
              {isHotel && (
                <div className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-white/30">
                  <Clock className="w-2.5 h-2.5" />
                  Hourly · Pay at Desk
                </div>
              )}
            </div>
          </div>

          {/* Content Area — Liquid spacing */}
          <div className="flex flex-col flex-1 p-3.5 pb-1.5 md:p-4 md:pb-2">
            {/* Title */}
            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>

            {/* Location */}
            <p className="flex items-center gap-1 text-gray-500 text-xs mt-1.5 truncate font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              {listing.city?.name || 'Local City'}
            </p>

            {/* Price Display */}
            {isHotel ? (
              <div className="flex items-baseline justify-between mt-2.5 pt-2 border-t border-gray-100/80">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-gray-900">
                    ₹{Number(listing.price) > 950 ? Math.max(199, Math.round((Number(listing.price) * 0.23) / 10) * 10 - 1) : 199}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#0033CC] liquid-glass-pill px-2 py-0.5">
                    / 2 Hours
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Instant
                </span>
              </div>
            ) : listing.price ? (
              <div className="flex items-baseline gap-1 mt-2.5 pt-2 border-t border-gray-100/80">
                <span className="text-sm font-black text-gray-900">
                  ₹{Number(listing.price).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-semibold text-gray-500">
                  {listing.priceType === 'PER_MONTH'
                    ? '/ month'
                    : listing.priceType === 'ONE_TIME'
                    ? 'visiting fee'
                    : ''}
                </span>
              </div>
            ) : null}
          </div>
        </Link>

        {/* Action Buttons — Fluid Specular Buttons */}
        <div className="p-3 pt-1.5 md:p-4 md:pt-2 mt-auto">
          {isHotel ? (
            <div className="flex items-center gap-2">
              <a 
                href={`tel:+91${cleanPhone}`}
                className="flex-1 flex items-center justify-center gap-1.5 liquid-glass text-gray-800 transition-all py-2 rounded-xl text-xs font-bold shadow-2xs active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                Call
              </a>
              <button
                type="button"
                onClick={handleOpenBooking}
                className="flex-[2] flex items-center justify-center gap-1.5 liquid-glass-blue text-white shadow-xs transition-all py-2 rounded-xl text-xs font-black cursor-pointer active:scale-95"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
                Book Hourly
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a 
                href={`tel:+91${cleanPhone}`}
                className="flex-1 flex items-center justify-center gap-1.5 liquid-glass-blue text-white shadow-xs transition-all py-2 rounded-xl text-xs font-bold active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-[#CCFF00]" />
                Call Owner
              </a>
              <a 
                href={`https://wa.me/91${cleanWhatsApp}?text=Hi,%20I%20am%20interested%20in%20your%20listing%20${encodeURIComponent(listing.title)}%20on%20SearchBook`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 liquid-glass text-emerald-700 hover:bg-emerald-50 border border-emerald-200/60 shadow-xs transition-all py-2 rounded-xl text-xs font-bold active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </a>
              <button
                type="button"
                onClick={handleOpenBooking}
                className="flex-1 flex items-center justify-center gap-1.5 liquid-glass text-[#0033CC] transition-all py-2 rounded-xl text-xs font-bold cursor-pointer active:scale-95"
              >
                Book
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Booking Modal */}
      {isBookingOpen && (
        <HourlyBookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          listing={{
            id: listing.id,
            title: listing.title,
            address: listing.city.name,
            price: typeof listing.price === 'string' ? parseFloat(listing.price) : listing.price,
            priceType: listing.priceType,
            photos: listing.photos,
          }}
        />
      )}
    </>
  );
}
