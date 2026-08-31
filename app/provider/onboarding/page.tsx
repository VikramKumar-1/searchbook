'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const LISTING_CATEGORIES = [
  {
    group: 'Accommodation & Stay',
    items: [
      { slug: 'flats', label: 'Flats & Apartments', emoji: '🏢', description: '1RK, 1BHK, 2BHK, 3BHK, Sharing' },
      { slug: 'pg-hostel', label: 'PG & Hostel', emoji: '🏠', description: 'Boys PG, Girls PG, Co-living' },
      { slug: 'hourly-hotels', label: 'Hourly Hotels', emoji: '🏨', description: 'Couple Friendly, Transit, Short Stay' },
    ],
  },
  {
    group: 'Food & Meals',
    items: [
      { slug: 'mess-tiffin', label: 'Mess & Tiffin Service', emoji: '🍱', description: 'Veg, Non-Veg, Student Mess, Diet Meals' },
      { slug: 'home-cook', label: 'Home Cook & Chef', emoji: '👨‍🍳', description: 'Personal cook for home, parties' },
    ],
  },
  {
    group: 'Repair & Maintenance',
    items: [
      { slug: 'plumber', label: 'Plumbing & Repairs', emoji: '🔧', description: 'Pipe leak, tap, geyser, tank cleaning' },
      { slug: 'electrician', label: 'Electrician', emoji: '⚡', description: 'Wiring, switches, MCB, fan, inverter' },
      { slug: 'ac-repair', label: 'AC Service & Repair', emoji: '❄️', description: 'Deep clean, gas refill, installation' },
      { slug: 'carpenter', label: 'Carpenter', emoji: '🪚', description: 'Furniture repair, bed, wardrobe, door' },
      { slug: 'painter', label: 'Painter', emoji: '🎨', description: 'Room painting, waterproofing, POP' },
    ],
  },
  {
    group: 'Cleaning & Household',
    items: [
      { slug: 'maid', label: 'Maid & Helper', emoji: '🧹', description: 'Daily cleaning, utensils, cooking' },
      { slug: 'pest-control', label: 'Pest Control', emoji: '🐛', description: 'Cockroach, termite, bed bugs, rats' },
      { slug: 'laundry', label: 'Laundry & Ironing', emoji: '👕', description: 'Wash, dry clean, steam iron, pickup' },
    ],
  },
  {
    group: 'Supply & Delivery',
    items: [
      { slug: 'gas-delivery', label: 'LPG Gas Cylinder', emoji: '🔥', description: 'Indane, HP, Bharat Gas refill & new' },
      { slug: 'water-supply', label: 'Water Tanker & Can', emoji: '💧', description: '20L can, tanker, RO water supply' },
      { slug: 'milk-delivery', label: 'Milk & Dairy', emoji: '🥛', description: 'Daily milk, curd, paneer delivery' },
    ],
  },
  {
    group: 'Other Services',
    items: [
      { slug: 'packers-movers', label: 'Packers & Movers', emoji: '📦', description: 'House shifting, office moving' },
      { slug: 'driver', label: 'Driver on Call', emoji: '🚗', description: 'Personal driver, outstation, monthly' },
      { slug: 'other-service', label: 'Something Else', emoji: '🛠️', description: 'CCTV, internet, RO repair, tailor' },
    ],
  },
];

export default function ProviderOnboarding() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    router.push(`/provider/create?category=${selected}`);
  };

  const selectedItem = LISTING_CATEGORIES
    .flatMap(g => g.items)
    .find(i => i.slug === selected);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
            ← Back to Home
          </a>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Step 1 of 2
          </span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 py-8 px-5">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            What do you want to list?
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Select one category that best describes your service or property.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="space-y-6">
          {LISTING_CATEGORIES.map((group) => (
            <div key={group.group}>
              {/* Group Label */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
                {group.group}
              </p>

              {/* Items */}
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 shadow-sm">
                {group.items.map((item) => {
                  const isSelected = selected === item.slug;

                  return (
                    <button
                      key={item.slug}
                      onClick={() => setSelected(item.slug)}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
                        isSelected
                          ? 'bg-blue-50 ring-1 ring-inset ring-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl select-none shrink-0">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {item.description}
                        </p>
                      </div>
                      {/* Radio indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Continue Button */}
        <div className="sticky bottom-0 bg-gray-50 pt-6 pb-8 mt-6">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`w-full py-3.5 rounded-lg font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              selected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selected ? `Continue as "${selectedItem?.label}"` : 'Select a category to continue'}
            {selected && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </main>
  );
}
