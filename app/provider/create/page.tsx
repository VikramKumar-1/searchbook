import React from 'react';
import { ListingForm } from '@frontend/components/provider/ListingForm';

const CATEGORY_TITLES: Record<string, string> = {
  flats: 'List a Flat or Apartment',
  'pg-hostel': 'List a PG or Hostel',
  'hourly-hotels': 'List an Hourly Hotel',
  'mess-tiffin': 'List a Mess or Tiffin Service',
  'home-cook': 'Offer Home Cook / Chef Service',
  plumber: 'Offer Plumbing Services',
  electrician: 'Offer Electrical Services',
  maid: 'Offer Maid / Helper Services',
  'gas-delivery': 'Offer Gas Cylinder Delivery',
  'water-supply': 'Offer Water Supply Service',
  'ac-repair': 'Offer AC Service & Repair',
  carpenter: 'Offer Carpentry Services',
  painter: 'Offer Painting Services',
  'pest-control': 'Offer Pest Control Service',
  laundry: 'Offer Laundry & Ironing Service',
  'milk-delivery': 'Offer Milk & Dairy Delivery',
  'packers-movers': 'Offer Packers & Movers Service',
  driver: 'Offer Driver on Call Service',
  'other-service': 'List Your Service',
};

export default async function CreateListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category || 'flats';
  const title = CATEGORY_TITLES[categorySlug] || 'Create a New Listing';

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/provider/onboarding" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
            ← Change Category
          </a>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Step 2 of 2
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-100 py-8 px-5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-2">
            Fill in the details below to make your listing live on SearchBook.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-5 py-10">
        <ListingForm categorySlug={categorySlug} />
      </div>
    </main>
  );
}
