'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@frontend/lib/apiClient';
import { useAuthStore } from '@frontend/stores/authStore';
import {
  Calendar, Clock, MapPin, Phone, ShieldCheck, CheckCircle2,
  Copy, ExternalLink, Loader2, Hotel, ArrowRight, Search, Check, Star
} from 'lucide-react';
import { BookingData } from '@frontend/modules/booking/hooks/useBookings';

export function MyBookingsView() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const [phoneSearch, setPhoneSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const { data: bookings = [], isLoading, refetch } = useQuery<BookingData[]>({
    queryKey: ['user-bookings', user?.id, phoneSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (phoneSearch.trim().length >= 10) {
        params.append('phone', phoneSearch.trim());
      }
      const url = `/api/v1/user/bookings${params.toString() ? `?${params.toString()}` : ''}`;
      return apiClient.get<BookingData[]>(url);
    },
    enabled: Boolean(user?.id || phoneSearch.trim().length >= 10),
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return b.status === 'CONFIRMED' || b.status === 'CHECKED_IN';
    if (activeTab === 'completed') return b.status === 'COMPLETED' || b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              My Hotel Bookings & Stays
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              View your booking codes, check-in timings, and Pay-at-Hotel details.
            </p>
          </div>

          {!user && (
            <button
              onClick={() => openAuthModal('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
            >
              Sign In to View All Bookings
            </button>
          )}
        </div>

        {/* ── PHONE NUMBER LOOKUP (FOR GUEST USERS) ── */}
        {!user && (
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
            <label className="block text-xs font-bold text-gray-800">
              Find Bookings by Mobile Number
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  placeholder="Enter 10-digit mobile number used during booking"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* ── TABS ── */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upcoming / Active
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Past Stays
          </button>
        </div>

        {/* ── BOOKING CARDS LIST ── */}
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-medium">Loading your reservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-2xs space-y-3">
            <Hotel className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-900">No Reservations Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven't booked any hourly or daily hotel stays yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <span>Explore Couple-Friendly Hotels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isConfirmed = b.status === 'CONFIRMED';
              const isCheckedIn = b.status === 'CHECKED_IN';
              const isCompleted = b.status === 'COMPLETED';
              const isCancelled = b.status === 'CANCELLED';

              const photoUrl = b.listing?.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80';

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img
                          src={photoUrl}
                          alt={b.listing?.title || 'Hotel'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                          BOOKING CODE
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg font-black text-blue-900 tracking-wider">
                            {b.bookingCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(b.bookingCode)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode === b.bookingCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {isConfirmed && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Confirmed (Pay at Desk)
                        </span>
                      )}
                      {isCheckedIn && (
                        <span className="text-xs font-bold text-blue-800 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Checked In (In Room)
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
                          Completed Stay
                        </span>
                      )}
                      {isCancelled && (
                        <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-3 py-1 rounded-full">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-medium block text-[10px] uppercase">Property</span>
                      <Link
                        href={`/listing/${b.listing?.slug}`}
                        className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1 mt-0.5"
                      >
                        {b.listing?.title}
                      </Link>
                      <span className="text-gray-500 text-[11px] block truncate">{b.listing?.address}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-medium block text-[10px] uppercase">Check-In Timing</span>
                      <span className="font-bold text-gray-900 block mt-0.5">
                        {b.checkInDate}
                      </span>
                      <span className="text-gray-600 text-[11px] block font-semibold">
                        {b.checkInTime} ──► {b.checkOutTime || `${b.durationHours}h`}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-medium block text-[10px] uppercase">Guests & Setup</span>
                      <span className="font-bold text-gray-900 block mt-0.5">
                        {b.guestName} ({b.guestsCount} Guests)
                      </span>
                      <span className="text-emerald-700 text-[11px] font-semibold block">
                        👫 Couple Discretion Guaranteed
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-medium block text-[10px] uppercase">Payment at Desk</span>
                      <span className="text-base font-black text-gray-900 block mt-0.5">
                        ₹{b.totalAmount || '199'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Cash / UPI on Check-in
                      </span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500 text-[11px]">
                      {isCompleted ? 'Stay completed · Thank you for choosing SearchBook.' : 'Show Booking ID at hotel reception desk.'}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Rate Stay CTA for Completed Stays */}
                      {isCompleted && (
                        b.isReviewed ? (
                          <span className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Reviewed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              window.dispatchEvent(
                                new CustomEvent('sb:open-review-modal', {
                                  detail: {
                                    id: b.id,
                                    bookingCode: b.bookingCode,
                                    checkInDate: b.checkInDate,
                                    checkInTime: b.checkInTime,
                                    checkOutTime: b.checkOutTime,
                                    guestName: b.guestName,
                                    listingId: b.listingId,
                                    listing: b.listing,
                                  },
                                })
                              );
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            Rate Stay
                          </button>
                        )
                      )}

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.listing?.title} ${b.listing?.address}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        Directions
                      </a>

                      {b.listing?.slug && (
                        <Link
                          href={`/listing/${b.listing.slug}`}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          View Hotel
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
