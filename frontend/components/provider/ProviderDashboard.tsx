'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Eye, MessageSquare, CheckCircle2,
  Clock, Trash2, Power, MapPin, Tag,
  Building2, Home, Search, Loader2, AlertCircle,
  CalendarCheck, Phone, MessageCircle, User, ShieldCheck, XCircle, Check,
  FileText, X, ExternalLink
} from 'lucide-react';
import {
  useProviderDashboard,
  useToggleListingStatus,
  useDeleteListing,
} from '@frontend/modules/listing/hooks/useProviderDashboard';
import {
  useProviderBookings,
  useUpdateBookingStatus,
  BookingData
} from '@frontend/modules/booking/hooks/useBookings';
import { useAuthStore } from '@frontend/stores/authStore';

export function ProviderDashboard() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');
  const [idModalBooking, setIdModalBooking] = useState<BookingData | null>(null);

  // Listings Query & Mutations
  const { data, isLoading, isError, error } = useProviderDashboard();
  const toggleMutation = useToggleListingStatus();
  const deleteMutation = useDeleteListing();

  // Bookings Query & Mutation
  const { data: bookings = [], isLoading: isBookingsLoading } = useProviderBookings();
  const updateBookingStatusMutation = useUpdateBookingStatus();

  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      alert('Failed to delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch {
      alert('Failed to update listing status.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: BookingData['status']) => {
    try {
      await updateBookingStatusMutation.mutateAsync({ bookingId, status });
    } catch {
      alert('Failed to update booking status.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-5 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Please Sign In to View Your Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
          You need to be logged in to manage your properties, services, and live listings.
        </p>
        <button
          onClick={() => openAuthModal('login', '/provider/dashboard')}
          className="mt-5 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
        >
          Sign In to Dashboard
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-5 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-5">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-600">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" />
          <p className="font-semibold text-sm">Failed to load dashboard</p>
          <p className="text-xs text-red-500 mt-1">{(error as Error)?.message || 'Something went wrong.'}</p>
        </div>
      </div>
    );
  }

  const listings = data?.listings || [];
  const stats = data?.stats || {
    totalListings: 0,
    activeListings: 0,
    pausedListings: 0,
    totalViews: 0,
    totalReviews: 0,
  };

  const filteredListings = listings.filter((l) => {
    if (filter === 'active' && !l.isActive) return false;
    if (filter === 'paused' && l.isActive) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.category.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingBookingsCount = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, <span className="font-semibold text-gray-900">{user.name}</span>. Manage your business & properties.
          </p>
        </div>
        <Link
          href="/provider/onboarding"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Listing
        </Link>
      </div>

      {/* Main Tabs (Listings vs Bookings) */}
      <div className="flex border-b border-gray-200 mt-6 gap-8">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          My Listings ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 relative ${
            activeTab === 'bookings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Hourly Bookings & Stays
          {pendingBookingsCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {pendingBookingsCount} New
            </span>
          )}
        </button>
      </div>

      {/* ────────────────── TAB 1: LISTINGS ────────────────── */}
      {activeTab === 'listings' && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalListings}</p>
              <p className="text-xs text-gray-500 mt-1">Listed under your account</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live & Active</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Visible to searchers</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Views</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Eye className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Listing impressions</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Reviews</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Customer ratings</p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 w-full sm:w-auto">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  filter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({stats.totalListings})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  filter === 'active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active ({stats.activeListings})
              </button>
              <button
                onClick={() => setFilter('paused')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  filter === 'paused' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Paused ({stats.pausedListings})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, location..."
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Listing Cards List */}
          {filteredListings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No listings found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your filters or search terms to find what you are looking for.'
                  : 'You haven’t listed any business or property yet. Create your first listing to start getting customers.'}
              </p>
              <Link
                href="/provider/onboarding"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className={`bg-white border rounded-xl p-4 sm:p-5 transition-all shadow-xs hover:border-gray-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    listing.isActive ? 'border-gray-200' : 'border-gray-200 bg-gray-50/50 opacity-80'
                  }`}
                >
                  {/* Left Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {listing.customCategory || listing.category.name}
                      </span>

                      {listing.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Live & Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          <Clock className="w-3 h-3" />
                          Paused
                        </span>
                      )}

                      {listing.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {listing.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {listing.city?.name || 'City'}, {listing.address.slice(0, 35)}...
                      </span>

                      {listing.price !== null && (
                        <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                          ₹{listing.price.toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] text-gray-500 font-normal">
                            {listing.priceType === 'PER_MONTH'
                              ? '/ month'
                              : listing.priceType === 'PER_DAY'
                              ? '/ day'
                              : listing.priceType === 'PER_MEAL'
                              ? '/ meal'
                              : listing.priceType === 'ONE_TIME'
                              ? 'one time'
                              : ''}
                          </span>
                        </span>
                      )}

                      {listing.tenantType && (
                        <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                          {listing.tenantType.replace('_', ' ')}
                        </span>
                      )}

                      {listing.bhkType && (
                        <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                          {listing.bhkType.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Stats & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mr-2">
                      <span className="flex items-center gap-1" title="Views">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        {listing.viewCount} views
                      </span>
                      <span className="flex items-center gap-1" title="Reviews">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                        {listing._count.reviews} reviews
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggle(listing.id)}
                      disabled={toggleMutation.isPending}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        listing.isActive
                          ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
                          : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                      title={listing.isActive ? 'Pause listing' : 'Activate listing'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {listing.isActive ? 'Pause' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleDelete(listing.id, listing.title)}
                      disabled={deletingId === listing.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete listing"
                    >
                      {deletingId === listing.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── TAB 2: HOURLY BOOKINGS ────────────────── */}
      {activeTab === 'bookings' && (
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Hotel & Stay Reservations</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Customers book on site with <span className="font-semibold text-emerald-700">"Pay at Hotel on Arrival"</span>. Collect payment at front desk.
              </p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pay at Hotel Desk
            </span>
          </div>

          {isBookingsLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Loading reservations...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No Reservations Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                When customers book hourly stays or rooms on your listings, their reservation details and check-in times will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {bookings.map((b) => {
                const isConfirmed = b.status === 'CONFIRMED';
                const isCheckedIn = b.status === 'CHECKED_IN';
                const isCompleted = b.status === 'COMPLETED';
                const isCancelled = b.status === 'CANCELLED';

                return (
                  <div
                    key={b.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Guest & Stay Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Booking Code */}
                        <span className="bg-blue-50 text-blue-800 text-xs font-black px-2.5 py-0.5 rounded border border-blue-200 tracking-wider">
                          {b.bookingCode}
                        </span>

                        {/* Status Badge */}
                        {isConfirmed && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            ● Confirmed (Pending Check-in)
                          </span>
                        )}
                        {isCheckedIn && (
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            ● Checked In (Guest in Room)
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                            Completed & Paid
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            Cancelled
                          </span>
                        )}

                        {/* Package Badge */}
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {b.stayPackage === 'DAY_ONLY'
                            ? '☀️ Day Only (9 AM - 6 PM)'
                            : b.stayPackage === 'NIGHT_ONLY'
                            ? '🌙 Night Only (8 PM - 8 AM)'
                            : b.stayPackage === 'HOURLY_2H'
                            ? '⚡ 2h Quick Stay'
                            : b.stayPackage === 'HOURLY_3H'
                            ? '⭐ 3h Stay'
                            : b.stayPackage === 'HOURLY_6H'
                            ? '⏳ 6h Half Day'
                            : b.stayPackage === 'FULL_DAY'
                            ? '🏨 24h Full Stay'
                            : `${b.durationHours}h Stay`}
                        </span>

                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded">
                          Pay at Desk: ₹{b.totalAmount || '199'}
                        </span>
                      </div>

                      {/* Guest Name & Property */}
                      <h3 className="text-base font-bold text-gray-900">
                        {b.guestName}{' '}
                        <span className="text-xs font-normal text-gray-500">
                          ({b.guestsCount} Guests) · {b.listing?.title}
                        </span>
                      </h3>

                      {/* Check-in to Check-out Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-1.5">
                        <span className="flex items-center gap-1 font-bold text-gray-900">
                          <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                          {b.checkInDate}
                        </span>

                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {b.checkInTime} ──► {b.checkOutTime || `${b.durationHours}h`}
                        </span>

                        <span className="flex items-center gap-1 text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {b.guestPhone}
                        </span>
                      </div>

                      {b.specialRequests && (
                        <p className="text-[11px] text-gray-500 mt-1 italic">
                          "Note: {b.specialRequests}"
                        </p>
                      )}
                    </div>

                    {/* Right: Actions */}
                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                      {/* View Guest ID (If uploaded via Express Check-In) */}
                      {(b.guestIdPhoto || b.guestIdNumber) && (
                        <button
                          type="button"
                          onClick={() => setIdModalBooking(b)}
                          className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          View Guest ID
                        </button>
                      )}

                      {/* One Click Contact */}
                      <a
                        href={`tel:${b.guestPhone}`}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5 text-gray-600" />
                        Call
                      </a>

                      <a
                        href={`https://wa.me/91${b.guestPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(b.guestName)},%20regarding%20your%20hourly%20booking%20${b.bookingCode}%20at%20${encodeURIComponent(b.listing?.title || 'our hotel')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                        title="Message on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        WhatsApp
                      </a>

                      {/* Status Management */}
                      {isConfirmed && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'CHECKED_IN')}
                          disabled={updateBookingStatusMutation.isPending}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark Checked In
                        </button>
                      )}

                      {isCheckedIn && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                          disabled={updateBookingStatusMutation.isPending}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Complete & Paid
                        </button>
                      )}

                      {!isCancelled && !isCompleted && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                          disabled={updateBookingStatusMutation.isPending}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── GUEST ID VERIFICATION MODAL ────────────────── */}
      {idModalBooking && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIdModalBooking(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Express Check-In ID Verification
                  </h3>
                  <p className="text-xs text-blue-700 font-medium">
                    Booking Code: {idModalBooking.bookingCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIdModalBooking(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Guest Meta Details */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-500 font-medium block">PRIMARY GUEST</span>
                  <span className="font-bold text-gray-900 text-sm">{idModalBooking.guestName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-medium block">PHONE NUMBER</span>
                  <span className="font-bold text-gray-900 text-sm">{idModalBooking.guestPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-medium block">ID DOCUMENT TYPE</span>
                  <span className="font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded inline-block mt-0.5">
                    {idModalBooking.guestIdType || 'Govt Photo ID'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-medium block">ID / AADHAAR NUMBER</span>
                  <span className="font-mono font-bold text-gray-900 text-xs">
                    {idModalBooking.guestIdNumber || 'Attached Below'}
                  </span>
                </div>
              </div>

              {/* ID Photo */}
              <div>
                <span className="text-xs font-bold text-gray-900 block mb-2">
                  Uploaded ID Photo / Document:
                </span>
                {idModalBooking.guestIdPhoto ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-black/5 relative group">
                    <img
                      src={idModalBooking.guestIdPhoto}
                      alt="Guest Govt ID"
                      className="w-full h-auto max-h-72 object-contain mx-auto rounded-lg"
                    />
                    <a
                      href={idModalBooking.guestIdPhoto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Full Size
                    </a>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-gray-50 rounded-xl border border-gray-200 text-gray-500">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-1.5" />
                    <p className="font-medium">No ID photo uploaded</p>
                    <p className="text-[10px] text-gray-400">Guest provided ID number only.</p>
                  </div>
                )}
              </div>

              {/* 5-Second Check-in Note */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  <strong>Express Check-in Guarantee:</strong> Guest has pre-attached ID details. Match the Booking Code at the desk, collect ₹{idModalBooking.totalAmount || '199'}, and hand over the room key without delay!
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 flex items-center gap-2 bg-gray-50">
              {idModalBooking.status === 'CONFIRMED' && (
                <button
                  type="button"
                  onClick={async () => {
                    await handleUpdateBookingStatus(idModalBooking.id, 'CHECKED_IN');
                    setIdModalBooking(null);
                  }}
                  className="flex-1 bg-blue-600 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Mark Checked In & Hand Room Key
                </button>
              )}
              <button
                type="button"
                onClick={() => setIdModalBooking(null)}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
