'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, Phone, MessageCircle, CalendarCheck, Clock } from 'lucide-react';
import { HourlyBookingModal } from '@frontend/components/booking/HourlyBookingModal';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    slug: string;
    price: string | number;
    priceType: string;
    photos: string[];
    city: { id: string; name: string; slug: string };
    category: { id: string; name: string; slug: string; icon: string | null };
    _count: { reviews: number };
  };
  fallbackImage?: string;
}

export function ListingCard({ listing, fallbackImage }: ListingCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const defaultFallback = fallbackImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80';
  const [imageSrc, setImageSrc] = useState(listing.photos[0] || defaultFallback);
  const isHotel = listing.category.slug === 'hourly-hotels' || listing.category.slug === 'hotels';

  return (
    <>
      <div className="group flex flex-col rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300">
        
        {/* Clickable Area for Image and Details */}
        <Link 
          href={`/${listing.city?.slug || 'city'}/${listing.category?.slug || 'hotels'}/${listing.slug}`} 
          className="flex flex-col flex-1"
        >
          {/* Image Area with 4:3 Aspect Ratio, Object-Cover and Ambient Backdrop for extreme sizes */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            {/* Ambient Background Layer (Handles extreme aspect ratios seamlessly) */}
            <div 
              className="absolute inset-0 bg-cover bg-center scale-125 blur-lg opacity-25"
              style={{ backgroundImage: `url(${imageSrc})` }}
            />

            {/* Main Image */}
            <img
              src={imageSrc}
              alt={listing.title}
              loading="lazy"
              onError={() => setImageSrc(defaultFallback)}
              className="relative z-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Top Left Badge - Category */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs border border-gray-100">
              {listing.category.name}
            </div>
            
            {/* Top Right Badge - Rating */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-xs">
              <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" /> 
              <span>4.8</span>
            </div>

            {/* Pay at Hotel Banner for Hotels */}
            {isHotel && (
              <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                Hourly Stays · Pay at Hotel
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex flex-col flex-1 p-4 pb-2">
            {/* Title */}
            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{listing.city.name}</span>
            </div>

            {/* Price Display on Front Card */}
            {isHotel ? (
              <div className="flex items-baseline justify-between mt-2.5 pt-2 border-t border-gray-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-gray-900">
                    ₹{Number(listing.price) > 950 ? Math.max(199, Math.round((Number(listing.price) * 0.23) / 10) * 10 - 1) : 199}
                  </span>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    / 2 Hours (Min)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Pay at Desk
                </span>
              </div>
            ) : listing.price ? (
              <div className="flex items-baseline gap-1 mt-2.5 pt-2 border-t border-gray-100">
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

        {/* Action Buttons */}
        <div className="p-4 pt-2 mt-auto">
          {isHotel ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-all py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                Book Hourly (Pay at Hotel)
              </button>
              
              <div className="flex items-center gap-2">
                <a 
                  href="tel:+919999999999" 
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all py-1.5 rounded-lg text-[11px] font-semibold"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </a>
                <a 
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all py-1.5 rounded-lg text-[11px] font-semibold"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a 
                href="tel:+919999999999" 
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-all py-2 rounded-lg text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
              <a 
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-xs transition-all py-2 rounded-lg text-xs font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

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
