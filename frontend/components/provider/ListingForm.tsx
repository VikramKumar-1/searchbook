'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, X, Check, Building2 } from 'lucide-react';
import { LocationPicker } from './LocationPicker';
import { ImageGalleryUploader } from './ImageGalleryUploader';
import { useAuthStore } from '@frontend/stores/authStore';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  categorySlug: z.string().min(1),
  
  address: z.string().min(5, 'Please select your location'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  citySlug: z.string().min(1),
  localitySlug: z.string().optional(),
  
  price: z.coerce.number().nonnegative().optional(),
  priceType: z.enum(['PER_MONTH', 'PER_DAY', 'ONE_TIME', 'PER_MEAL']).optional(),
  serviceRadiusKm: z.coerce.number().positive().max(100).optional(),
  
  // Flat / PG specific
  tenantType: z.enum(['BACHELOR', 'FAMILY', 'GIRLS_ONLY', 'BOYS_ONLY', 'ANYONE']).optional(),
  furnishing: z.enum(['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']).optional(),
  bhkType: z.enum(['RK_1', 'BHK_1', 'BHK_2', 'BHK_3', 'BHK_4_PLUS']).optional(),
  
  // "Something Else"
  customCategory: z.string().min(3).max(100).optional(),
  
  // Hourly Hotel timings & capacity
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  totalRooms: z.coerce.number().int().min(1).max(500).optional(),
  
  photos: z.array(z.string()),
  amenities: z.array(z.string()),
  
  contactPhone: z.string().min(10, 'Valid 10-digit calling number required').max(15),
  contactWhatsApp: z.string().min(10, 'Valid 10-digit WhatsApp number required').max(15),
});

type FormValues = z.infer<typeof formSchema>;

// Categories that are fixed locations (show map pin + flat-specific fields)
const FIXED_CATEGORIES = ['flats', 'pg-hostel', 'hourly-hotels', 'mess-tiffin', 'home-cook'];
const FLAT_CATEGORIES = ['flats', 'pg-hostel']; // Show tenant type, BHK, furnishing
const ROAMING_CATEGORIES = ['plumber', 'maid', 'electrician', 'pest-control', 'gas-delivery', 'water-supply', 'ac-repair', 'carpenter', 'painter', 'laundry', 'packers-movers', 'driver', 'milk-delivery'];

const POPULAR_AMENITIES = [
  'WiFi', 'Air Conditioner (AC)', 'Attached Washroom', 'Geyser / Hot Water',
  'RO Drinking Water', 'Power Backup', 'Parking Space', 'CCTV & Security',
  'Elevator / Lift', 'TV', 'Balcony', 'Daily Housekeeping', 'Refrigerator', 'Washing Machine', 'Couples Welcome'
];

export function ListingForm({ categorySlug }: { categorySlug: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const isFixed = FIXED_CATEGORIES.includes(categorySlug);
  const isFlat = FLAT_CATEGORIES.includes(categorySlug);
  const isRoaming = ROAMING_CATEGORIES.includes(categorySlug);
  const isHotel = categorySlug === 'hourly-hotels';
  const isOther = categorySlug === 'other-service';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      categorySlug,
      title: '',
      description: '',
      address: '',
      photos: [],
      amenities: [],
      contactPhone: '',
      contactWhatsApp: '',
      ...(isRoaming ? { priceType: 'ONE_TIME', serviceRadiusKm: 5 } : {}),
      ...(isHotel ? { priceType: 'PER_DAY', price: 899, openingTime: '08:00 AM', closingTime: '11:00 PM' } : {}),
      ...(isFixed && !isHotel ? { priceType: 'PER_MONTH' } : {}),
      ...(isFlat ? { tenantType: 'ANYONE', furnishing: 'SEMI_FURNISHED', bhkType: 'BHK_1' } : {}),
    },
  });

  const amenities = form.watch('amenities');

  const addAmenity = (val?: string) => {
    const textToAdd = val || newAmenity;
    if (!textToAdd.trim()) return;

    // Split by comma in case user types or pastes "WiFi, AC, Geyser"
    const items = textToAdd
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const updated = [...amenities];
    items.forEach(item => {
      if (!updated.includes(item)) {
        updated.push(item);
      }
    });

    form.setValue('amenities', updated);
    setNewAmenity('');
  };

  const toggleAmenity = (am: string) => {
    if (amenities.includes(am)) {
      form.setValue('amenities', amenities.filter(a => a !== am));
    } else {
      form.setValue('amenities', [...amenities, am]);
    }
  };

  const removeAmenity = (am: string) => {
    form.setValue('amenities', amenities.filter(a => a !== am));
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 sm:p-12 text-center max-w-md mx-auto my-12 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#0033CC] flex items-center justify-center mx-auto shadow-xs">
          <Building2 className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-gray-900">Account Required to List</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Please sign in to SearchBook first. Your listing and bookings will be securely linked to your account.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openAuthModal('login', `/provider/create?category=${categorySlug}`)}
          className="w-full bg-[#0033CC] hover:bg-[#002699] text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-md cursor-pointer active:scale-[0.98]"
        >
          Sign In with Google to Continue
        </button>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setServerError('Please login to publish your listing.');
      openAuthModal('login');
      return;
    }

    setIsLoading(true);
    setServerError('');
    try {
      const res = await fetch('/api/v1/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) {
        const msg = json.error?.message || 'Failed to create listing';
        setServerError(msg);
        if (res.status === 401 || msg.toLowerCase().includes('login')) {
          openAuthModal('login');
        }
        return;
      }
      if (user && user.role !== 'PROVIDER') {
        setUser({ ...user, role: 'PROVIDER' });
      }
      router.push('/provider/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred. Please check your connection.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Shared input class
  const inputCls = "w-full px-4 py-2.5 rounded-md bg-white text-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-md">
          {serverError}
        </div>
      )}

      {/* ── "Something Else" Custom Category ── */}
      {isOther && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Your Service</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">What service do you offer?</label>
            <input
              {...form.register('customCategory')}
              placeholder="e.g. CCTV Installation, Tailor, RO Repair"
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">This will be shown to customers as your service type</p>
          </div>
        </div>
      )}

      {/* ── Basic Details ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Listing Title</label>
          <input
            {...form.register('title')}
            placeholder={isRoaming || isOther ? "e.g. Ravi Kumar — Expert Plumber" : "e.g. Spacious 2BHK near Saket Metro"}
            className={inputCls}
          />
          {form.formState.errors.title && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            {...form.register('description')}
            rows={4}
            placeholder="Tell customers about your business, what you offer, timings, etc."
            className={`${inputCls} resize-none`}
          />
          {form.formState.errors.description && <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>}
        </div>
      </div>

      {/* ── Flat / PG Specific Fields ── */}
      {isFlat && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Property Details</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tenant Type</label>
              <select {...form.register('tenantType')} className={inputCls}>
                <option value="ANYONE">Anyone (All Welcome)</option>
                <option value="BACHELOR">Bachelors Only</option>
                <option value="FAMILY">Family Only</option>
                <option value="BOYS_ONLY">Boys Only</option>
                <option value="GIRLS_ONLY">Girls Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">BHK Type</label>
              <select {...form.register('bhkType')} className={inputCls}>
                <option value="RK_1">1 RK / Studio</option>
                <option value="BHK_1">1 BHK</option>
                <option value="BHK_2">2 BHK</option>
                <option value="BHK_3">3 BHK</option>
                <option value="BHK_4_PLUS">4 BHK+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Furnishing</label>
              <select {...form.register('furnishing')} className={inputCls}>
                <option value="FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Hourly Hotel Timings Configuration ── */}
      {isHotel && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Hourly Check-in & Operating Hours
          </h2>
          <p className="text-xs text-gray-500">
            Set the hours during which guests can check in for hourly stays (Minimum duration starts from 2 hours).
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Daily Check-in Starts</label>
              <select {...form.register('openingTime')} className={inputCls}>
                <option value="06:00 AM">06:00 AM (Early Morning)</option>
                <option value="07:00 AM">07:00 AM</option>
                <option value="08:00 AM">08:00 AM (Standard)</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="12:00 PM">12:00 PM (Noon)</option>
                <option value="24_HOURS">24 Hours (Open All Day & Night)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Check-in Closes</label>
              <select {...form.register('closingTime')} className={inputCls}>
                <option value="09:00 PM">09:00 PM</option>
                <option value="10:00 PM">10:00 PM</option>
                <option value="11:00 PM">11:00 PM (Standard Night)</option>
                <option value="12:00 AM">12:00 AM (Midnight)</option>
                <option value="24_HOURS">24 Hours (Open All Night)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Hourly Rooms</label>
              <input
                {...form.register('totalRooms')}
                type="number"
                defaultValue={5}
                min={1}
                max={500}
                placeholder="e.g. 5"
                className={inputCls}
              />
              <p className="text-[10px] text-gray-500 mt-1">Number of rooms allocated for hourly stays</p>
            </div>
          </div>

          {/* Bed & Room Type Allocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bed Type</label>
              <select
                className={inputCls}
                onChange={(e) => {
                  const bed = e.target.value;
                  const currentAmenities = form.getValues('amenities');
                  const filtered = currentAmenities.filter(a => !a.includes('Bed'));
                  form.setValue('amenities', [...filtered, bed]);
                }}
              >
                <option value="1 King Double Bed">1 King Size Double Bed (Standard Couple)</option>
                <option value="1 Queen Double Bed">1 Queen Size Double Bed</option>
                <option value="2 Twin Single Beds">2 Twin Single Beds</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Category</label>
              <select
                className={inputCls}
                onChange={(e) => {
                  const roomType = e.target.value;
                  const currentAmenities = form.getValues('amenities');
                  const filtered = currentAmenities.filter(a => !a.includes('Room') && !a.includes('Suite'));
                  form.setValue('amenities', [...filtered, roomType]);
                }}
              >
                <option value="Deluxe AC Room">Deluxe AC Room</option>
                <option value="Super Deluxe AC Room">Super Deluxe AC Room</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Standard Non-AC Room">Standard Non-AC Room</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Photos & Gallery ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Photos & Gallery</h2>
        <ImageGalleryUploader
          photos={form.watch('photos')}
          onChange={(newPhotos) => form.setValue('photos', newPhotos)}
          maxPhotos={10}
        />
      </div>

      {/* ── Location ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Location</h2>
        <LocationPicker
          showMapTab={isFixed}
          onLocationSelected={(loc) => {
            form.setValue('latitude', loc.latitude);
            form.setValue('longitude', loc.longitude);
            form.setValue('address', loc.address);
            form.setValue('citySlug', loc.citySlug);
            if (loc.localitySlug) form.setValue('localitySlug', loc.localitySlug);
            form.clearErrors('address');
          }}
          error={form.formState.errors.address?.message}
        />
        <input type="hidden" {...form.register('address')} />
        <input type="hidden" {...form.register('latitude')} />
        <input type="hidden" {...form.register('longitude')} />
      </div>

      {/* ── Pricing & Scope ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Pricing</h2>
        
        {/* If Hourly Hotel: Only 24-Hour Price Input (Hourly Slabs are 100% Platform-Controlled) */}
        {isHotel ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Full 24-Hour Day Room Price (₹) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Enter your standard 24-hour room price. SearchBook platform will automatically calculate and lock all customer hourly stay slabs (2h, 3h, 6h, Day & Night).
              </p>
              <input
                {...form.register('price')}
                type="number"
                defaultValue={899}
                placeholder="e.g. 899"
                className={`max-w-md ${inputCls}`}
              />
            </div>

            {/* Hidden field for priceType */}
            <input type="hidden" {...form.register('priceType')} value="PER_DAY" />

            {/* Live Stay Slabs Preview */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">
                    ⚡ Auto-Calculated Customer Booking Slabs (Platform Locked)
                  </span>
                  <span className="text-[11px] text-blue-700 font-medium">
                    Search Card Starting Price: <strong className="text-blue-900 font-black">₹{Number(form.watch('price')) > 950 ? Math.max(199, Math.round((Number(form.watch('price')) * 0.23) / 10) * 10 - 1) : 199} / 2 Hours</strong>
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
                  Pay at Hotel Desk
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex justify-between items-center shadow-2xs">
                  <span className="font-semibold text-gray-700">⚡ 2 Hours (Min):</span>
                  <span className="font-black text-blue-700">
                    ₹{Number(form.watch('price')) > 950 ? Math.max(199, Math.round((Number(form.watch('price')) * 0.23) / 10) * 10 - 1) : 199}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex justify-between items-center shadow-2xs">
                  <span className="font-semibold text-gray-700">⭐ 3 Hours:</span>
                  <span className="font-black text-blue-700">
                    ₹{Number(form.watch('price')) > 950 ? Math.max(299, Math.round((Number(form.watch('price')) * 0.34) / 10) * 10 - 1) : 299}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex justify-between items-center shadow-2xs">
                  <span className="font-semibold text-gray-700">⏳ 6 Hours:</span>
                  <span className="font-black text-blue-700">
                    ₹{Number(form.watch('price')) > 950 ? Math.max(499, Math.round((Number(form.watch('price')) * 0.55) / 10) * 10 - 1) : 499}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex justify-between items-center shadow-2xs">
                  <span className="font-semibold text-gray-700">☀️ Day Only:</span>
                  <span className="font-black text-blue-700">
                    ₹{Number(form.watch('price')) > 950 ? Math.max(599, Math.round((Number(form.watch('price')) * 0.67) / 10) * 10 - 1) : 599}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex justify-between items-center shadow-2xs">
                  <span className="font-semibold text-gray-700">🌙 Night Only:</span>
                  <span className="font-black text-blue-700">
                    ₹{Number(form.watch('price')) > 950 ? Math.max(699, Math.round((Number(form.watch('price')) * 0.78) / 10) * 10 - 1) : 699}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex justify-between items-center shadow-2xs">
                  <span className="font-semibold text-gray-700">🏨 24h Full Stay:</span>
                  <span className="font-black text-blue-700">₹{form.watch('price') || 899}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Categories: Rent / Visiting Charge */
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isRoaming || isOther ? 'Visiting Charge (₹) — Optional' : 'Rent / Price (₹) — Optional'}
              </label>
              <input
                {...form.register('price')}
                type="number"
                placeholder="e.g. 5000"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Type</label>
              <select {...form.register('priceType')} className={inputCls}>
                {isRoaming || isOther ? (
                  <option value="ONE_TIME">One Time</option>
                ) : (
                  <>
                    <option value="PER_MONTH">Per Month</option>
                    <option value="PER_DAY">Per Day</option>
                    <option value="PER_MEAL">Per Meal</option>
                  </>
                )}
              </select>
            </div>
          </div>
        )}

        {(isRoaming || isOther) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Radius (KM)</label>
            <select {...form.register('serviceRadiusKm')} className={inputCls}>
              <option value={2}>Within 2 KM — Very Local</option>
              <option value={5}>Within 5 KM — Standard</option>
              <option value={10}>Within 10 KM</option>
              <option value={25}>Within 25 KM — Whole City</option>
            </select>
          </div>
        )}
      </div>

      {/* ── Contact ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Calling Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              {...form.register('contactPhone')}
              placeholder="e.g. 9876543210"
              className={inputCls}
            />
            {form.formState.errors.contactPhone && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.contactPhone.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-gray-900">
                WhatsApp Number <span className="text-red-500">* (Mandatory)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const calling = form.getValues('contactPhone');
                  if (calling) form.setValue('contactWhatsApp', calling);
                }}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer underline"
              >
                Same as Calling Number
              </button>
            </div>
            <input
              {...form.register('contactWhatsApp')}
              placeholder="e.g. 9876543210"
              className={inputCls}
            />
            {form.formState.errors.contactWhatsApp && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.contactWhatsApp.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Amenities (Fixed locations only) ── */}
      {isFixed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold text-gray-900">Amenities & Facilities</h2>
            <span className="text-xs text-gray-500 font-medium">
              {amenities.length} selected
            </span>
          </div>

          {/* Quick Selectable Chips */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">Quick Add Popular Amenities:</p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_AMENITIES.map((item) => {
                const isAdded = amenities.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleAmenity(item)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAdded
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input with Auto-Comma Separation */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Add Custom Amenity (Type with Comma or press Enter)
            </label>
            <div className="flex gap-2">
              <input
                value={newAmenity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes(',')) {
                    addAmenity(val);
                  } else {
                    setNewAmenity(val);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                placeholder="e.g. Swimming Pool, Gym, Study Table (type comma to add)"
                className={`flex-1 ${inputCls}`}
              />
              <button
                type="button"
                onClick={() => addAmenity()}
                className="px-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Custom & Active Tags */}
          {amenities.length > 0 && (
            <div className="pt-1">
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Active Amenities for this Listing:</p>
              <div className="flex flex-wrap gap-2">
                {amenities.map((am) => (
                  <div
                    key={am}
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    <span>{am}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(am)}
                      className="hover:bg-blue-200/60 rounded-full p-0.5 text-blue-600 transition-colors cursor-pointer"
                      title="Remove amenity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Submit ── */}
      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading || !form.watch('address')}
          className="w-full bg-blue-600 text-white font-semibold text-base py-3.5 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isLoading ? 'Creating...' : 'Publish Listing'}
        </button>
        {!form.watch('address') && (
          <p className="text-center text-red-500 text-xs font-medium mt-3">
            * Select a location above to publish
          </p>
        )}
      </div>
    </form>
  );
}
