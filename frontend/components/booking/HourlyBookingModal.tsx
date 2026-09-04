'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X, Calendar, Clock, Check, Phone, User, Loader2,
  ChevronDown, ChevronUp, Camera, MapPin, ArrowRight, ShieldCheck,
  CheckCircle2, Lock, HeartHandshake, KeyRound
} from 'lucide-react';
import { useCreateBooking } from '@frontend/modules/booking/hooks/useBookings';
import { convertToWebP } from '@frontend/lib/imageCompressor';
import { useAuthStore } from '@frontend/stores/authStore';

interface HourlyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    address: string;
    price?: number | null;
    priceType?: string | null;
    photos?: string[];
    openingTime?: string | null;
    closingTime?: string | null;
  };
}

export type StayPackageType = 'HOURLY_2H' | 'HOURLY_3H' | 'HOURLY_6H' | 'DAY_ONLY' | 'NIGHT_ONLY' | 'FULL_DAY';

interface PackageOption {
  id: StayPackageType;
  title: string;
  subtitle?: string;
  price: number;
  durationHours: number;
  fixedTimes?: { checkIn: string; checkOut: string; isNextDay?: boolean };
}

const STAY_PACKAGES: PackageOption[] = [
  { id: 'HOURLY_2H', title: '2 Hours', subtitle: 'Short Stay', price: 199, durationHours: 2 },
  { id: 'HOURLY_3H', title: '3 Hours', subtitle: 'Standard', price: 299, durationHours: 3 },
  { id: 'HOURLY_6H', title: '6 Hours', subtitle: 'Half Day', price: 499, durationHours: 6 },
  { id: 'DAY_ONLY', title: 'Day Stay', subtitle: '9 AM – 6 PM', price: 599, durationHours: 9, fixedTimes: { checkIn: '09:00 AM', checkOut: '06:00 PM', isNextDay: false } },
  { id: 'NIGHT_ONLY', title: 'Night Stay', subtitle: '8 PM – 8 AM', price: 699, durationHours: 12, fixedTimes: { checkIn: '08:00 PM', checkOut: '08:00 AM', isNextDay: true } },
  { id: 'FULL_DAY', title: '24 Hours', subtitle: 'Flexible 24h', price: 899, durationHours: 24 },
];

const ALL_TIME_SLOTS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
  '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
];

function parseSlotToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const min = parseInt(match[2], 10) || 0;
  const period = match[3]?.toUpperCase();
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour * 60 + min;
}

function calculateCheckOutDisplay(checkInTime: string, durationHours: number): string {
  const match = checkInTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return `${durationHours}h`;

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3]?.toUpperCase();

  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  const totalHours = hour + durationHours;
  const isNextDay = totalHours >= 24;
  const outHour24 = totalHours % 24;

  const outPeriod = outHour24 >= 12 ? 'PM' : 'AM';
  let outHour12 = outHour24 % 12;
  if (outHour12 === 0) outHour12 = 12;

  const formattedHour = outHour12 < 10 ? `0${outHour12}` : `${outHour12}`;
  return `${formattedHour}:${minute} ${outPeriod}${isNextDay ? ' (+1 Day)' : ''}`;
}

function getDynamicPackagePrice(basePrice: number, pkgId: StayPackageType): number {
  if (basePrice <= 950) {
    if (pkgId === 'HOURLY_2H') return 199;
    if (pkgId === 'HOURLY_3H') return 299;
    if (pkgId === 'HOURLY_6H') return 499;
    if (pkgId === 'DAY_ONLY') return 599;
    if (pkgId === 'NIGHT_ONLY') return 699;
    return Math.round(basePrice) || 899;
  }
  if (pkgId === 'HOURLY_2H') return Math.max(199, Math.round((basePrice * 0.23) / 10) * 10 - 1);
  if (pkgId === 'HOURLY_3H') return Math.max(299, Math.round((basePrice * 0.34) / 10) * 10 - 1);
  if (pkgId === 'HOURLY_6H') return Math.max(499, Math.round((basePrice * 0.55) / 10) * 10 - 1);
  if (pkgId === 'DAY_ONLY') return Math.max(599, Math.round((basePrice * 0.67) / 10) * 10 - 1);
  if (pkgId === 'NIGHT_ONLY') return Math.max(699, Math.round((basePrice * 0.78) / 10) * 10 - 1);
  return Math.round(basePrice);
}

export function HourlyBookingModal({ isOpen, onClose, listing }: HourlyBookingModalProps) {
  const createBookingMutation = useCreateBooking();

  const hotelBasePrice = listing.price ? Number(listing.price) : 899;

  const dynamicPackages = useMemo(() => {
    return STAY_PACKAGES.map((pkg) => ({
      ...pkg,
      price: getDynamicPackagePrice(hotelBasePrice, pkg.id),
    }));
  }, [hotelBasePrice]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [activeTab, setActiveTab] = useState<'stay' | 'guest'>('stay');
  const [selectedPkg, setSelectedPkg] = useState<StayPackageType>('HOURLY_2H');
  const [date, setDate] = useState(() => todayStr);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const isToday = date === todayStr;

  // Filter slots by hotel operating hours AND current time
  const availableTimeSlots = useMemo(() => {
    let slots = ALL_TIME_SLOTS;

    // Filter by hotel's operational opening and closing hours
    if (listing.openingTime && listing.closingTime) {
      const openMins = parseSlotToMinutes(listing.openingTime);
      const closeMins = parseSlotToMinutes(listing.closingTime);

      if (openMins > 0 || closeMins > 0) {
        if (closeMins > openMins) {
          // Standard daytime operating hours (e.g. 10:00 AM to 10:00 PM)
          slots = slots.filter((t) => {
            const m = parseSlotToMinutes(t);
            return m >= openMins && m <= closeMins;
          });
        } else if (closeMins < openMins) {
          // Overnight operating hours (e.g. 08:00 PM to 08:00 AM)
          slots = slots.filter((t) => {
            const m = parseSlotToMinutes(t);
            return m >= openMins || m <= closeMins;
          });
        }
      }
    }

    // If booking for today, filter out past time slots
    if (isToday) {
      const now = new Date();
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const futureSlots = slots.filter((t) => parseSlotToMinutes(t) >= currentMins);
      return futureSlots.length > 0 ? futureSlots : (slots.length > 0 ? [slots[slots.length - 1]] : ['11:30 PM']);
    }

    return slots.length > 0 ? slots : ALL_TIME_SLOTS;
  }, [isToday, listing.openingTime, listing.closingTime]);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const customTime = selectedTimeSlot && availableTimeSlots.includes(selectedTimeSlot)
    ? selectedTimeSlot
    : (availableTimeSlots[0] || '02:00 PM');
  const setCustomTime = setSelectedTimeSlot;

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || 'unset';
      };
    }
  }, [isOpen]);

  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const isGenericName = (n?: string | null) => !n || ['Verified Guest', 'Google User', 'Apple User', 'User'].includes(n.trim());

  const [guests, setGuests] = useState(2);
  const [name, setName] = useState(user?.name && !isGenericName(user.name) ? user.name : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [error, setError] = useState('');

  // Auto-sync guest fields whenever user logs in or profile updates
  useEffect(() => {
    if (user) {
      if (user.name && !isGenericName(user.name)) {
        setName(user.name);
      }
      if (user.phone) {
        setPhone(user.phone);
      }
    }
  }, [user]);

  // Express Check-in
  const [isExpressCheckInOpen, setIsExpressCheckInOpen] = useState(false);
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState('');
  const [isUploadingId, setIsUploadingId] = useState(false);

  const [confirmedBooking, setConfirmedBooking] = useState<{
    code: string;
    amount: number | null;
    checkInTime: string;
    checkOutTime: string;
    packageTitle: string;
  } | null>(null);

  const activePackage = dynamicPackages.find((p) => p.id === selectedPkg) || dynamicPackages[0];
  const isFixedTiming = Boolean(activePackage.fixedTimes);

  const resolvedCheckIn = activePackage.fixedTimes ? activePackage.fixedTimes.checkIn : customTime;
  const resolvedCheckOut = useMemo(() => {
    if (activePackage.fixedTimes) {
      return activePackage.fixedTimes.checkOut + (activePackage.fixedTimes.isNextDay ? ' (+1 Day)' : '');
    }
    return calculateCheckOutDisplay(customTime, activePackage.durationHours);
  }, [activePackage, customTime]);

  if (!isOpen) return null;

  const handleContinueToGuest = () => {
    setError('');
    if (!user) {
      openAuthModal('phone-otp');
      return;
    }
    setActiveTab('guest');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('phone-otp');
      setError('Please login or verify your mobile number with OTP to confirm booking.');
      return;
    }

    const resolvedName = (name.trim() || user.name || '').trim();
    const resolvedPhone = (user.phone || phone || '').replace(/\D/g, '').trim();

    if (!resolvedName || isGenericName(resolvedName)) {
      setError('Please enter your full name for hotel check-in');
      return;
    }
    if (!resolvedPhone || resolvedPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number for hotel reception check-in');
      return;
    }

    setError('');
    try {
      const result = await createBookingMutation.mutateAsync({
        listingId: listing.id,
        guestName: resolvedName,
        guestPhone: resolvedPhone,
        checkInDate: date,
        checkInTime: resolvedCheckIn,
        checkOutTime: resolvedCheckOut,
        durationHours: activePackage.durationHours,
        stayPackage: selectedPkg,
        guestsCount: guests,
        guestIdType: idPhoto || idNumber ? idType : undefined,
        guestIdNumber: idNumber.trim() || undefined,
        guestIdPhoto: idPhoto || undefined,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('sb_guest_phone', phone.trim());
      }

      setConfirmedBooking({
        code: result.bookingCode,
        amount: result.totalAmount,
        checkInTime: resolvedCheckIn,
        checkOutTime: resolvedCheckOut,
        packageTitle: activePackage.title,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to complete booking. Please try again.';
      setError(message);
    }
  };

  const resetAndClose = () => {
    setConfirmedBooking(null);
    setError('');
    setActiveTab('stay');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200" 
        onClick={resetAndClose} 
      />

      {/* Modal Container (SearchBook 3D Clay Ticket Tablet) */}
      <div className="relative w-full max-w-[500px] bg-[#EFF4FA] rounded-[36px] shadow-[0_30px_70px_rgba(15,35,70,0.3),inset_0_3px_6px_rgba(255,255,255,0.95)] overflow-hidden border-2 border-white z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* ── TOP 3D CLAY HEADER ── */}
        <div className="p-5 pb-3 bg-white border-b-2 border-[#E2E8F0] shadow-xs shrink-0 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#0033CC] bg-[#EAF3FD] px-2.5 py-0.5 rounded-full border border-[#CCE1FD]">
                Instant Stay Pass
              </span>
              <span className="text-[10px] font-black text-[#2F6B4F] bg-[#E3ECE6] px-2 py-0.5 rounded-full">
                Pay at Hotel
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#0f172a] truncate mt-1 leading-snug">
              {listing.title}
            </h2>
          </div>

          <button
            onClick={resetAndClose}
            className="w-10 h-10 rounded-full bg-[#F0F5FB] border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all cursor-pointer shrink-0 hover:scale-105"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* ── 2-STEP 3D CLAY PROGRESS TABS (ONLY IF NOT CONFIRMED) ── */}
        {!confirmedBooking && (
          <div className="px-5 pt-3 shrink-0">
            <div className="grid grid-cols-2 gap-2 bg-[#E2EAF4] p-1.5 rounded-[22px] border-2 border-white shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('stay')}
                className={`py-2 px-3 rounded-[18px] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'stay'
                    ? 'bg-white text-[#0033CC] shadow-[0_4px_12px_rgba(0,51,204,0.15),inset_0_2px_3px_rgba(255,255,255,0.95)] scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>1. Duration & Timing</span>
                {activeTab === 'guest' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guest')}
                className={`py-2 px-3 rounded-[18px] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'guest'
                    ? 'bg-white text-[#0033CC] shadow-[0_4px_12px_rgba(0,51,204,0.15),inset_0_2px_3px_rgba(255,255,255,0.95)] scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>2. Guest Details</span>
              </button>
            </div>
          </div>
        )}

        {/* ── SCROLLABLE CONTENT BODY ── */}
        <div className="p-5 overflow-y-auto space-y-4 text-gray-900 overscroll-contain flex-1">
          {confirmedBooking ? (
            /* ── CONFIRMATION 3D CLAY PASS ── */
            <div className="py-2 text-center space-y-4">
              <div className="w-16 h-16 bg-[#E3ECE6] text-[#2F6B4F] rounded-[24px] border-2 border-white shadow-[0_8px_20px_rgba(117,159,137,0.25),inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-950 tracking-tight">Stay Confirmed!</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Show this pass at hotel desk for 1-minute key handover.</p>
              </div>

              {/* 3D Passcode Box */}
              <div className="bg-white border-2 border-white rounded-[28px] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.95)] text-center space-y-2.5">
                <span className="text-[10px] font-black text-[#0033CC] uppercase tracking-wider block bg-[#EAF3FD] border border-[#CCE1FD] py-1 px-3.5 rounded-full w-max mx-auto">
                  Reception Booking Passcode
                </span>
                <span className="text-3xl font-black tracking-widest block font-mono text-gray-950">
                  {confirmedBooking.code}
                </span>
                <span className="text-xs font-black text-black bg-[#CCFF00] border border-[#B8E600] px-4 py-1.5 rounded-full inline-block shadow-2xs">
                  Pay ₹{confirmedBooking.amount} at Hotel Desk
                </span>
              </div>

              {/* Summary Details */}
              <div className="bg-white rounded-[24px] p-4.5 border-2 border-white shadow-2xs text-xs space-y-2 text-left">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Stay Option:</span>
                  <span className="font-bold text-gray-900">{confirmedBooking.packageTitle} ({confirmedBooking.checkInTime} – {confirmedBooking.checkOutTime})</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Date:</span>
                  <span className="font-bold text-gray-900">{date}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Guest:</span>
                  <span className="font-bold text-gray-900">{name} ({guests} Guests)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full bg-gradient-to-r from-[#0033CC] via-[#1A56DB] to-[#2563EB] text-white font-black text-xs py-4 rounded-[22px] transition-all cursor-pointer shadow-[0_10px_24px_rgba(0,51,204,0.35),inset_0_2px_4px_rgba(255,255,255,0.35)] hover:scale-[1.02]"
              >
                Done · View My Bookings
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-xs font-bold px-4 py-3 rounded-2xl border-2 border-red-100 shadow-2xs">
                  {error}
                </div>
              )}

              {/* ════════ STEP 1: DURATION & TIMING TAB ════════ */}
              {activeTab === 'stay' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  
                  {/* Package Cards in 3D Clay */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0f172a] uppercase tracking-wider">
                        Choose Duration Package
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">6 Options</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {dynamicPackages.map((pkg) => {
                        const isSelected = selectedPkg === pkg.id;

                        return (
                          <button
                            type="button"
                            key={pkg.id}
                            onClick={() => setSelectedPkg(pkg.id)}
                            className={`p-3 rounded-[22px] text-left transition-all cursor-pointer border-2 flex flex-col justify-between min-h-[78px] ${
                              isSelected
                                ? 'bg-white border-[#0033CC] text-[#0033CC] shadow-[0_8px_20px_rgba(0,51,204,0.22),inset_0_2px_4px_rgba(255,255,255,0.95)] scale-[1.03] ring-2 ring-[#0033CC]'
                                : 'bg-white border-white hover:bg-white/80 text-gray-800 shadow-[0_4px_10px_rgba(0,0,0,0.03)]'
                            }`}
                          >
                            <span className={`text-xs font-black block ${isSelected ? 'text-[#0033CC]' : 'text-gray-900'}`}>
                              {pkg.title}
                            </span>
                            <div className="mt-1 flex items-baseline justify-between">
                              <span className={`text-xs font-black ${isSelected ? 'text-[#0033CC]' : 'text-[#0f172a]'}`}>
                                ₹{pkg.price}
                              </span>
                              <span className={`text-[9px] font-bold ${isSelected ? 'text-[#0033CC]' : 'text-gray-400'}`}>
                                {pkg.subtitle}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ultra-Optimized Glassmorphic Stay Schedule Console */}
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl p-4.5 rounded-[28px] border-2 border-white shadow-[0_16px_36px_rgba(0,51,204,0.08),inset_0_2px_4px_rgba(255,255,255,0.95)] space-y-3.5">
                    {/* Ambient Glass Glow Flares */}
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0033CC]/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#CCFF00]/15 rounded-full blur-xl pointer-events-none" />

                    {/* Section Header with Live Indicator */}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0033CC] animate-pulse" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                          Select Check-in Schedule
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-[#0033CC] bg-[#EAF3FD]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#CCE1FD]">
                        Instant Confirmation
                      </span>
                    </div>

                    {/* Quick 1-Tap Glass Date Chips: Today & Tomorrow Only */}
                    <div className="grid grid-cols-2 gap-2.5 relative z-10">
                      <button
                        type="button"
                        onClick={() => setDate(todayStr)}
                        className={`py-2.5 px-3.5 rounded-[20px] text-xs font-black transition-all cursor-pointer border-2 flex items-center justify-between ${
                          date === todayStr
                            ? 'bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white border-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.35)] scale-[1.02]'
                            : 'bg-white/85 backdrop-blur-md border-white text-gray-800 hover:bg-white shadow-2xs'
                        }`}
                      >
                        <div className="text-left">
                          <span className="block text-xs font-black">⚡ Today</span>
                          <span className={`text-[10px] font-bold block ${date === todayStr ? 'text-white/80' : 'text-gray-400'}`}>Instant Stay</span>
                        </div>
                        {date === todayStr && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDate(tomorrowStr)}
                        className={`py-2.5 px-3.5 rounded-[20px] text-xs font-black transition-all cursor-pointer border-2 flex items-center justify-between ${
                          date === tomorrowStr
                            ? 'bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white border-white shadow-[0_8px_18px_rgba(0,51,204,0.32),inset_0_2px_3px_rgba(255,255,255,0.35)] scale-[1.02]'
                            : 'bg-white/85 backdrop-blur-md border-white text-gray-800 hover:bg-white shadow-2xs'
                        }`}
                      >
                        <div className="text-left">
                          <span className="block text-xs font-black">📅 Tomorrow</span>
                          <span className={`text-[10px] font-bold block ${date === tomorrowStr ? 'text-white/80' : 'text-gray-400'}`}>Advance Booking</span>
                        </div>
                        {date === tomorrowStr && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    </div>

                    {/* Glassmorphic Time Slot Selector Capsule */}
                    <div className="relative z-10 space-y-2">
                      <div className="bg-white/90 backdrop-blur-lg p-3 rounded-[22px] border-2 border-white shadow-2xs flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,51,204,0.25)] shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Check-in Slot</span>
                              {listing.openingTime && listing.closingTime && (
                                <span className="text-[8px] font-black text-[#0033CC] bg-[#EAF3FD] px-1.5 py-0.2 rounded-full border border-[#CCE1FD]">
                                  {listing.openingTime}–{listing.closingTime}
                                </span>
                              )}
                            </div>
                            <strong className="text-xs sm:text-sm font-black text-[#0f172a] block truncate">
                              {resolvedCheckIn}
                            </strong>
                          </div>
                        </div>

                        {isFixedTiming ? (
                          <span className="text-[10px] font-black text-gray-500 bg-[#EFF4FA] px-3 py-1.5 rounded-full border border-gray-200">
                            Fixed Time
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                            className="bg-[#EFF4FA] hover:bg-[#E2EAF4] text-xs font-black text-[#0033CC] px-4 py-2 rounded-full border-2 border-white shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <span>{customTime}</span>
                            {isTimePickerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>

                      {/* Expandable 3D Glass Time Matrix / Quick Slots */}
                      {!isFixedTiming && isTimePickerOpen && (
                        <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-[24px] border-2 border-white shadow-[0_12px_28px_rgba(0,51,204,0.15)] animate-in zoom-in-95 duration-150 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                              Choose Available Slot ({availableTimeSlots.length} Slots)
                            </span>
                            <span className="text-[9px] font-bold text-gray-400">Hotel Timing Verified</span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto overscroll-contain pr-1">
                            {availableTimeSlots.map((slot) => {
                              const isSelected = customTime === slot;
                              return (
                                <button
                                  type="button"
                                  key={slot}
                                  onClick={() => {
                                    setCustomTime(slot);
                                    setIsTimePickerOpen(false);
                                  }}
                                  className={`py-1.5 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-[#0033CC] text-white border-[#0033CC] shadow-sm scale-[1.05]'
                                      : 'bg-[#F0F5FB] hover:bg-white text-gray-800 border-white hover:border-[#CCE1FD]'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Illuminated 3D Glass Ticket Departure Timeline */}
                    <div className="relative z-10 bg-gradient-to-r from-[#002B99]/95 via-[#0033CC] to-[#1D4ED8] p-3 rounded-[20px] border-2 border-white/60 shadow-[0_8px_20px_rgba(0,51,204,0.3),inset_0_2px_3px_rgba(255,255,255,0.4)] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse" />
                        <div>
                          <span className="text-[9px] text-white/75 font-bold uppercase block">Arrival In</span>
                          <strong className="text-xs font-black text-white">{resolvedCheckIn}</strong>
                        </div>
                      </div>

                      <div className="flex flex-col items-center px-2">
                        <span className="text-[9px] font-black text-black bg-[#CCFF00] px-2 py-0.2 rounded-full shadow-2xs">
                          {activePackage.title}
                        </span>
                        <div className="w-16 h-0.5 bg-white/40 relative my-1">
                          <ArrowRight className="w-3.5 h-3.5 text-[#CCFF00] absolute right-0 -top-1.5" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <span className="text-[9px] text-white/75 font-bold uppercase block">Departure Out</span>
                          <strong className="text-xs font-black text-white">{resolvedCheckOut}</strong>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      </div>
                    </div>
                  </div>

                  {/* Guest & Room Setup Chips */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-[#0f172a] uppercase tracking-wider block">
                      Room & Occupancy
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setGuests(2)}
                        className={`py-2.5 px-3 rounded-[20px] text-xs font-black border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                          guests === 2
                            ? 'bg-white border-[#0033CC] text-[#0033CC] shadow-[0_6px_16px_rgba(0,51,204,0.18)] scale-[1.02] ring-2 ring-[#0033CC]'
                            : 'bg-white border-white text-gray-700 shadow-2xs hover:bg-white/80'
                        }`}
                      >
                        <span>👫 Couple (2)</span>
                        <span className="text-[9px] font-bold text-purple-700 mt-0.5">1 King Bed</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGuests(1)}
                        className={`py-2.5 px-3 rounded-[20px] text-xs font-black border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                          guests === 1
                            ? 'bg-white border-[#0033CC] text-[#0033CC] shadow-[0_6px_16px_rgba(0,51,204,0.18)] scale-[1.02] ring-2 ring-[#0033CC]'
                            : 'bg-white border-white text-gray-700 shadow-2xs hover:bg-white/80'
                        }`}
                      >
                        <span>👤 1 Guest</span>
                        <span className="text-[9px] font-bold text-gray-400 mt-0.5">1 Bed</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGuests(3)}
                        className={`py-2.5 px-3 rounded-[20px] text-xs font-black border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                          guests === 3
                            ? 'bg-white border-[#0033CC] text-[#0033CC] shadow-[0_6px_16px_rgba(0,51,204,0.18)] scale-[1.02] ring-2 ring-[#0033CC]'
                            : 'bg-white border-white text-gray-700 shadow-2xs hover:bg-white/80'
                        }`}
                      >
                        <span>👥 3 Guests</span>
                        <span className="text-[9px] font-bold text-amber-700 mt-0.5">+Extra Bed</span>
                      </button>
                    </div>
                  </div>

                  {/* Continue Button to Step 2 */}
                  <button
                    type="button"
                    onClick={handleContinueToGuest}
                    className="w-full bg-gradient-to-r from-[#0033CC] via-[#1A56DB] to-[#2563EB] hover:from-[#0029A3] hover:to-[#1D4ED8] text-white font-black text-xs sm:text-sm py-4 rounded-[22px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(0,51,204,0.35),inset_0_2px_4px_rgba(255,255,255,0.35)] hover:scale-[1.02]"
                  >
                    <span>Continue to Guest Details (₹{activePackage.price})</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              )}

              {/* ════════ STEP 2: GUEST DETAILS TAB ════════ */}
              {activeTab === 'guest' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  
                  {/* Couple Safe Guarantee Mini Card */}
                  <div className="bg-[#E3ECE6] border-2 border-white rounded-[22px] p-3 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#2F6B4F] shrink-0" />
                      <div>
                        <span className="text-xs font-black text-[#1E3A2B] block">Couple Safe & Zero Desk Questions</span>
                        <span className="text-[10px] text-[#2F6B4F] font-bold block">100% Legal · 18+ IDs · Pay at hotel on arrival</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-[#2F6B4F] bg-white px-2 py-0.5 rounded-full border border-[#C5DDD0] shrink-0">
                      Verified
                    </span>
                  </div>

                  {/* Guest Verification Status Banner */}
                  {user ? (
                    <div className="bg-[#E6F4EA] border border-[#A8DAB5] p-3 rounded-[20px] flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1E8E3E] text-white flex items-center justify-center font-black text-xs shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">{user.name}</span>
                          <span className="text-[10px] font-bold text-[#137333] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Guest: +91 {user.phone || phone}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-[#137333] bg-white px-2.5 py-0.5 rounded-full border border-[#CEEAD6]">
                        Logged In
                      </span>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/90 p-4 rounded-[22px] space-y-2.5 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#0033CC] shrink-0" />
                        <span className="text-xs font-black text-gray-900">Mobile Verification Required</span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                        To guarantee your room reservation and pay at hotel desk, please login with your mobile number.
                      </p>
                      <button
                        type="button"
                        onClick={() => openAuthModal('phone-otp')}
                        className="w-full bg-[#0033CC] text-white font-bold text-xs py-3 rounded-xl hover:bg-[#002699] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Verify Mobile Number with OTP
                      </button>
                    </div>
                  )}

                  {/* Guest Name & Mobile Form */}
                  <div className="bg-white p-4.5 rounded-[26px] border-2 border-white shadow-[0_6px_18px_rgba(30,70,120,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] space-y-3.5">
                    {/* Primary Guest Name */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-gray-700">Primary Guest Full Name</label>
                        {user?.name && !isGenericName(user.name) && (
                          <span className="text-[9px] text-[#2F6B4F] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Auto-filled from Profile ✓
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-[#F0F5FB] border-2 border-white rounded-[16px] pl-9 pr-3 py-2.5 text-xs font-bold text-gray-900 shadow-2xs focus:outline-none focus:border-[#0033CC]"
                        />
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Mobile Number Handling */}
                    {user?.phone ? (
                      /* If logged in via Phone OTP: DO NOT ASK FOR MOBILE NUMBER! Show locked verified badge! */
                      <div className="bg-[#F0F5FB] border border-[#CBD5E1] rounded-[18px] p-3 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#0033CC] text-white flex items-center justify-center shrink-0">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase block">Verified Mobile Number</span>
                            <strong className="text-xs font-black text-gray-900">+91 {user.phone}</strong>
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-[#0033CC] bg-white px-2.5 py-0.5 rounded-full border border-[#CCE1FD]">
                          Sent to Hotel ✓
                        </span>
                      </div>
                    ) : (
                      /* If logged in via Google/Email without phone: Ask for 10-digit mobile */
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-gray-700">10-Digit Mobile Number</label>
                          <span className="text-[9px] text-gray-400 font-bold">For Hotel Check-in</span>
                        </div>
                        <div className="relative">
                          <input
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className="w-full bg-[#F0F5FB] border-2 border-white rounded-[16px] pl-9 pr-3 py-2.5 text-xs font-bold text-gray-900 shadow-2xs focus:outline-none focus:border-[#0033CC]"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional Express Check-in */}
                  <div className="border-2 border-white bg-white rounded-[24px] overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsExpressCheckInOpen(!isExpressCheckInOpen)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 transition-colors text-xs font-black text-gray-900"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#EAF3FD] border border-[#CCE1FD] flex items-center justify-center shrink-0">
                          <KeyRound className="w-4 h-4 text-[#0033CC]" />
                        </div>
                        <div>
                          <span>{isExpressCheckInOpen ? 'Hide ID Verification Form' : 'Attach ID for 5-Second Key Handover'}</span>
                          <span className="text-[10px] font-medium text-gray-500 block">Aadhaar / Driving License / Voter ID</span>
                        </div>
                      </div>
                      {isExpressCheckInOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {isExpressCheckInOpen && (
                      <div className="p-4 pt-1 space-y-3 border-t border-[#EDE5D8] bg-[#F0F5FB]">
                        <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                          Pre-attach ID now to take room key in 5 seconds without physical document photocopy at desk.
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={idType}
                            onChange={(e) => setIdType(e.target.value)}
                            className="w-full bg-white border-2 border-white rounded-xl px-3 py-2 text-xs text-gray-800 font-bold shadow-2xs focus:outline-none focus:border-[#0033CC] cursor-pointer"
                          >
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Voter ID">Voter ID</option>
                            <option value="Passport">Passport</option>
                            <option value="College / Student ID">College / Student ID</option>
                          </select>

                          <input
                            type="text"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            placeholder="ID / Aadhaar Number"
                            className="w-full bg-white border-2 border-white rounded-xl px-3 py-2 text-xs text-gray-800 font-bold shadow-2xs focus:outline-none focus:border-[#0033CC]"
                          />
                        </div>

                        {/* ID Photo Upload */}
                        <div className="flex items-center gap-2">
                          <label className="flex-1 border-2 border-dashed border-[#CBD5E1] hover:border-[#0033CC] rounded-2xl py-2.5 px-3.5 text-center cursor-pointer bg-white hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-2 text-xs text-gray-800 font-bold shadow-2xs">
                            {isUploadingId ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#0033CC]" />
                            ) : idPhoto ? (
                              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                            ) : (
                              <Camera className="w-4 h-4 text-[#0033CC]" />
                            )}
                            <span>{idPhoto ? 'ID Attached (Click to Replace)' : 'Upload ID Card Photo / Snap'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingId(true);
                                try {
                                  const webpFile = await convertToWebP(file, 1400, 0.85);

                                  const formData = new FormData();
                                  formData.append('files', webpFile);
                                  formData.append('file', webpFile);
                                  const res = await fetch('/api/v1/upload', { method: 'POST', body: formData });
                                  const json = await res.json();
                                  if (json.success && (json.data?.url || json.data?.urls?.[0])) {
                                    setIdPhoto(json.data?.url || json.data?.urls?.[0]);
                                  } else {
                                    alert(json.error?.message || 'Failed to upload photo');
                                  }
                                } catch {
                                  alert('Network error while uploading');
                                } finally {
                                  setIsUploadingId(false);
                                }
                              }}
                            />
                          </label>
                          {idPhoto && (
                            <button
                              type="button"
                              onClick={() => setIdPhoto('')}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold border border-red-200 bg-white shadow-2xs"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary & Submit Action Bar */}
                  <div className="pt-2 flex items-center justify-between gap-4 border-t-2 border-white">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Amount</span>
                      <span className="text-2xl font-black text-gray-950">₹{activePackage.price}</span>
                      <span className="text-[10px] text-[#2F6B4F] font-bold block -mt-0.5">Pay at hotel desk</span>
                    </div>

                    <button
                      type="submit"
                      disabled={createBookingMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-[#0033CC] via-[#1A56DB] to-[#2563EB] hover:from-[#0029A3] hover:to-[#1D4ED8] text-white font-black text-xs sm:text-sm py-4 rounded-[22px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(0,51,204,0.38),inset_0_2px_4px_rgba(255,255,255,0.35)] hover:scale-[1.02] disabled:opacity-50"
                    >
                      {createBookingMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <>
                          <span>Confirm {activePackage.title} Stay</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
