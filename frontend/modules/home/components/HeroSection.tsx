/**
 * ═══════════════════════════════════════════════════════════
 * 🏠 HERO SECTION — Homepage Search & Headline
 * ═══════════════════════════════════════════════════════════
 *
 * 📱 Mobile: Claymorphism design inspired by Travel App + Blinkit
 *   - Soft pastel blue gradient background (clay-bg-blue)
 *   - Puffy clay search card with inset glow
 *   - Category tabs as clay pills with pastel colors
 *   - Clay input fields with soft inner shadows
 *   - Rounded-3xl everywhere for soft feel
 *
 * 🖥️ Desktop: Original blue hero with image column
 * ═══════════════════════════════════════════════════════════
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Grid, CheckCircle2, Home, Utensils, Wrench, Building, Clock, Mic, ShoppingBag, Gift, Headphones, Bed } from 'lucide-react';
import { LocationAutocomplete } from '@frontend/modules/home/components/LocationAutocomplete';
import { useCategoryNavStore, CATEGORY_THEMES, MobileCategoryKey } from '@frontend/stores/categoryNavStore';
import { useLocationStore } from '@frontend/stores/locationStore';

const categoryOptions = {
  'pg-hostel': [
    { value: 'all', label: 'All PGs & Hostels' },
    { value: 'boys-pg', label: 'Boys PG' },
    { value: 'girls-pg', label: 'Girls PG' },
    { value: 'co-living', label: 'Co-living (Gen-Z)' },
    { value: 'premium-pg', label: 'Premium / Luxury PG' },
  ],
  flats: [
    { value: 'all', label: 'All Flats' },
    { value: '1rk', label: '1 RK / Studio (Bachelors)' },
    { value: '1bhk', label: '1 BHK' },
    { value: '2bhk', label: '2 BHK (Sharing)' },
    { value: '3bhk', label: '3 BHK' },
    { value: 'fully-furnished', label: 'Fully Furnished' },
  ],
  services: [
    { value: 'all', label: 'All Services' },
    { value: 'maid', label: 'Maid / Bai' },
    { value: 'water-supply', label: 'Water Tanker Supply' },
    { value: 'milk-delivery', label: 'Milk Delivery' },
    { value: 'laundry', label: 'Laundry (Pick & Drop)' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'gas-agency', label: 'LPG Gas Cylinder Delivery' },
    { value: 'ac-repair', label: 'AC Service & Repair' },
    { value: 'pest-control', label: 'Pest Control' },
    { value: 'carpenter', label: 'Carpenter' },
  ],
  tiffin: [
    { value: 'all', label: 'All Tiffin & Mess' },
    { value: 'veg-tiffin', label: 'Pure Veg Tiffin' },
    { value: 'non-veg-tiffin', label: 'Veg & Non-Veg Tiffin' },
    { value: 'student-mess', label: 'Student Mess / Canteen' },
    { value: 'office-lunch', label: 'Corporate Office Lunch' },
    { value: 'diet-meals', label: 'Healthy / Gym Diet Meals' },
  ],
  'hourly-hotels': [
    { value: 'all', label: 'All Hourly Hotels' },
    { value: 'couples-friendly', label: 'Couples Friendly (Safe)' },
    { value: 'short-stay', label: 'Short Stay (2 - 4 Hrs)' },
    { value: 'transit-rest', label: 'Transit / Quick Rest' },
    { value: 'premium-hourly', label: 'Premium Hourly Stays' },
  ]
};

type TabType = 'pg-hostel' | 'flats' | 'services' | 'tiffin' | 'hourly-hotels';

import { FluentEmoji } from '@frontend/components/ui/FluentEmoji';

interface BentoColumnCard {
  title: string;
  badge?: string;
  price?: string;
  graphic: React.ReactNode | string;
  href: string;
  bgGradient?: string;
  glowColor?: string;
}

interface BentoCategoryData {
  banner: {
    tag: string;
    title: string;
    subtitle: string;
    icons: (React.ReactNode | string)[];
  };
  tallCard: {
    title: string;
    originalPrice?: string;
    priceBadge: string;
    subText: string;
    graphic: React.ReactNode | string;
    bottomBadge: string;
    href: string;
    bgGradient?: string;
    glowColor?: string;
  };
  col2Top: BentoColumnCard;
  col2Bottom: BentoColumnCard;
  col3Top: BentoColumnCard;
  col3Bottom: BentoColumnCard;
}

const MOBILE_CATEGORY_TABS: { key: MobileCategoryKey; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Home className="w-5 h-5 stroke-[2.2]" /> },
  { key: 'pg-hostel', label: 'PG/Hostel', icon: <Bed className="w-5 h-5 stroke-[2]" /> },
  { key: 'hourly-hotels', label: 'Hourly', icon: <Clock className="w-5 h-5 stroke-[2]" /> },
  { key: 'flats', label: 'Flats', icon: <Building className="w-5 h-5 stroke-[2]" /> },
  { key: 'services', label: 'Services', icon: <Wrench className="w-5 h-5 stroke-[2]" /> },
  { key: 'tiffin', label: 'Tiffin', icon: <Utensils className="w-5 h-5 stroke-[2]" /> },
];

const BENTO_DATA: Record<MobileCategoryKey, BentoCategoryData> = {
  all: {
    banner: {
      tag: 'VERIFIED & DIRECT',
      title: 'Instant Living',
      subtitle: 'Rooms from ₹199 · PGs from ₹4,999 · 0 Brokerage',
      icons: [
        <FluentEmoji key="1" name="Key" fallback="🔑" size={24} />,
        <FluentEmoji key="2" name="Office building" fallback="🏢" size={32} />,
        <FluentEmoji key="3" name="Luggage" fallback="🧳" size={24} />,
      ],
    },
    tallCard: {
      title: 'PG, Hostels\n& Co-living',
      originalPrice: '₹7,999',
      priceBadge: 'From ₹4,999',
      subText: 'Food, AC &\nWiFi Free',
      graphic: <FluentEmoji name="Bed" fallback="🛏️" size={56} />,
      bottomBadge: 'Boys & Girls',
      href: '/listings?category=pg-hostel',
      bgGradient: 'bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB]',
      glowColor: 'bg-blue-400/25',
    },
    col2Top: {
      title: 'Hourly\nHotels',
      badge: '₹199 / 2hr',
      graphic: <FluentEmoji name="Hotel" fallback="🏨" size={38} />,
      href: '/listings?category=hourly-hotels',
      bgGradient: 'bg-gradient-to-br from-[#9F1239] via-[#E11D48] to-[#FB7185]',
      glowColor: 'bg-rose-400/25',
    },
    col2Bottom: {
      title: 'Tiffin &\nMess Service',
      price: '₹70 / Meal',
      graphic: <FluentEmoji name="Pot of food" fallback="🍲" size={38} />,
      href: '/listings?category=tiffin',
      bgGradient: 'bg-gradient-to-br from-[#9A3412] via-[#EA580C] to-[#FB923C]',
      glowColor: 'bg-amber-400/25',
    },
    col3Top: {
      title: '1 RK &\nFlats',
      badge: '0 Brokerage',
      graphic: <FluentEmoji name="House" fallback="🏠" size={38} />,
      href: '/listings?category=flats',
      bgGradient: 'bg-gradient-to-br from-[#064E3B] via-[#059669] to-[#34D399]',
      glowColor: 'bg-emerald-400/25',
    },
    col3Bottom: {
      title: 'Home\nServices',
      price: 'Maid & AC',
      graphic: <FluentEmoji name="Wrench" fallback="🔧" size={38} />,
      href: '/listings?category=services',
      bgGradient: 'bg-gradient-to-br from-[#3730A3] via-[#4F46E5] to-[#818CF8]',
      glowColor: 'bg-indigo-400/25',
    },
  },
  'pg-hostel': {
    banner: {
      tag: 'VERIFIED PGs & HOSTELS',
      title: 'Student & Working PGs',
      subtitle: 'Food included · High-Speed WiFi · Zero Brokerage',
      icons: [
        <FluentEmoji key="1" name="Bed" fallback="🛏️" size={24} />,
        <FluentEmoji key="2" name="Antenna bars" fallback="📶" size={32} />,
        <FluentEmoji key="3" name="Cooking" fallback="🍳" size={24} />,
      ],
    },
    tallCard: {
      title: 'Boys & Girls\nLuxury PG',
      originalPrice: '₹8,500',
      priceBadge: '₹4,999/mo',
      subText: 'AC Rooms &\n3 Times Food',
      graphic: <FluentEmoji name="House with garden" fallback="🏠" size={56} />,
      bottomBadge: 'Top Rated',
      href: '/listings?category=pg-hostel',
    },
    col2Top: {
      title: 'Co-Living\nSpaces',
      badge: 'Gen-Z Hubs',
      graphic: <FluentEmoji name="Couch and lamp" fallback="🛋️" size={40} />,
      href: '/listings?category=pg-hostel&search=co-living',
    },
    col2Bottom: {
      title: 'Student\nHostels',
      badge: '₹3,499 / mo',
      graphic: <FluentEmoji name="Backpack" fallback="🎒" size={40} />,
      href: '/listings?category=pg-hostel&search=student',
    },
    col3Top: {
      title: 'Single Room\nWith Bath',
      badge: 'Private Wash',
      graphic: <FluentEmoji name="Shower" fallback="🚿" size={40} />,
      href: '/listings?category=pg-hostel&search=single',
    },
    col3Bottom: {
      title: 'Zero Deposit\nMove-In',
      badge: 'Instant Key',
      graphic: <FluentEmoji name="Key" fallback="🔑" size={40} />,
      href: '/listings?category=pg-hostel&search=zero-deposit',
    },
  },
  'hourly-hotels': {
    banner: {
      tag: 'PAY BY THE HOUR · 100% DISCREET',
      title: 'Hourly Stays & Hotels',
      subtitle: 'Couple friendly · Local IDs accepted · Pay at check-in',
      icons: [
        <FluentEmoji key="1" name="Stopwatch" fallback="⏱️" size={24} />,
        <FluentEmoji key="2" name="Bellhop bell" fallback="🛎️" size={32} />,
        <FluentEmoji key="3" name="Locked" fallback="🔒" size={24} />,
      ],
    },
    tallCard: {
      title: 'Couple Friendly\nShort Stays',
      originalPrice: '₹1,299',
      priceBadge: '₹299 / 3hr',
      subText: 'Local ID Accepted\n100% Private',
      graphic: <FluentEmoji name="Hotel" fallback="🏨" size={56} />,
      bottomBadge: 'Instant Check-in',
      href: '/listings?category=hourly-hotels',
    },
    col2Top: {
      title: 'Day-Use\nHotels',
      badge: '₹199 / 2hr',
      graphic: <FluentEmoji name="Hot beverage" fallback="☕" size={40} />,
      href: '/listings?category=hourly-hotels&search=day-use',
    },
    col2Bottom: {
      title: 'Transit\nRest Stays',
      badge: 'Station/Airport',
      graphic: <FluentEmoji name="Airplane" fallback="✈️" size={40} />,
      href: '/listings?category=hourly-hotels&search=transit',
    },
    col3Top: {
      title: 'Luxury Hotel\nRooms',
      badge: '4 & 5 Star',
      graphic: <FluentEmoji name="Star" fallback="⭐" size={40} />,
      href: '/listings?category=hourly-hotels&search=luxury',
    },
    col3Bottom: {
      title: 'Night Micro\nStays',
      badge: '6-Hour Pack',
      graphic: <FluentEmoji name="Crescent moon" fallback="🌙" size={40} />,
      href: '/listings?category=hourly-hotels&search=night',
    },
  },
  flats: {
    banner: {
      tag: 'DIRECT FROM OWNER · NO BROKERAGE',
      title: 'Flats & Apartments',
      subtitle: '1RK, 1BHK, 2BHK & 3BHK for bachelors and families',
      icons: [
        <FluentEmoji key="1" name="Office building" fallback="🏢" size={24} />,
        <FluentEmoji key="2" name="Couch and lamp" fallback="🛋️" size={32} />,
        <FluentEmoji key="3" name="Key" fallback="🔑" size={24} />,
      ],
    },
    tallCard: {
      title: '1 RK Studio\nApartments',
      originalPrice: '₹11,000',
      priceBadge: '₹6,499/mo',
      subText: 'Bachelors Welcome\nNo Brokerage',
      graphic: <FluentEmoji name="Office building" fallback="🏢" size={56} />,
      bottomBadge: 'Owner Direct',
      href: '/listings?category=flats',
    },
    col2Top: {
      title: '1 BHK Family\nFlats',
      badge: 'From ₹9,500',
      graphic: <FluentEmoji name="Door" fallback="🚪" size={40} />,
      href: '/listings?category=flats&search=1bhk',
    },
    col2Bottom: {
      title: '2 BHK Flat\nSharing',
      badge: '₹4,500 / person',
      graphic: <FluentEmoji name="People hugging" fallback="👥" size={40} />,
      href: '/listings?category=flats&search=2bhk',
    },
    col3Top: {
      title: 'Fully\nFurnished',
      badge: 'Ready to Move',
      graphic: <FluentEmoji name="Television" fallback="📺" size={40} />,
      href: '/listings?category=flats&search=furnished',
    },
    col3Bottom: {
      title: '3 BHK\nApartments',
      badge: 'Family Society',
      graphic: <FluentEmoji name="Cityscape" fallback="🏙️" size={40} />,
      href: '/listings?category=flats&search=3bhk',
    },
  },
  services: {
    banner: {
      tag: 'DOORSTEP SERVICES IN MINUTES',
      title: 'Home & Daily Services',
      subtitle: 'Verified cooks, maids, plumbers, water supply & repairs',
      icons: [
        <FluentEmoji key="1" name="Hammer and wrench" fallback="🛠️" size={24} />,
        <FluentEmoji key="2" name="Broom" fallback="🧹" size={32} />,
        <FluentEmoji key="3" name="Droplet" fallback="💧" size={24} />,
      ],
    },
    tallCard: {
      title: 'Cook & Maid\nService',
      originalPrice: '₹3,500',
      priceBadge: '₹1,499/mo',
      subText: 'Background Verified\nDaily Cooking & Clean',
      graphic: <FluentEmoji name="Broom" fallback="🧹" size={56} />,
      bottomBadge: 'Trained Staff',
      href: '/listings?category=services',
    },
    col2Top: {
      title: 'Water Tanker\nSupply',
      badge: 'In 30 Mins',
      graphic: <FluentEmoji name="Droplet" fallback="💧" size={40} />,
      href: '/listings?category=services&search=water',
    },
    col2Bottom: {
      title: 'Plumber &\nElectrician',
      badge: '₹149 Visit',
      graphic: <FluentEmoji name="High voltage" fallback="⚡" size={40} />,
      href: '/listings?category=services&search=electrician',
    },
    col3Top: {
      title: 'AC Service\n& Repair',
      badge: '30-Day Guarantee',
      graphic: <FluentEmoji name="Snowflake" fallback="❄️" size={40} />,
      href: '/listings?category=services&search=ac-repair',
    },
    col3Bottom: {
      title: 'Laundry Pick\n& Drop',
      badge: '₹49 / kg',
      graphic: <FluentEmoji name="T-shirt" fallback="👕" size={40} />,
      href: '/listings?category=services&search=laundry',
    },
  },
  tiffin: {
    banner: {
      tag: 'GHAR KA KHANA · HYGIENIC & FRESH',
      title: 'Tiffin & Mess Services',
      subtitle: 'Home-cooked veg & non-veg meals delivered to your doorstep',
      icons: [
        <FluentEmoji key="1" name="Bento box" fallback="🍱" size={24} />,
        <FluentEmoji key="2" name="Curry rice" fallback="🍛" size={32} />,
        <FluentEmoji key="3" name="Green salad" fallback="🥗" size={24} />,
      ],
    },
    tallCard: {
      title: 'Daily Ghar Jaisa\nTiffin Service',
      originalPrice: '₹3,200',
      priceBadge: '₹1,899/mo',
      subText: 'Roti, Dal, Sabzi, Rice\nFree Taste Trial',
      graphic: <FluentEmoji name="Bento box" fallback="🍱" size={56} />,
      bottomBadge: '100% Pure & Fresh',
      href: '/listings?category=tiffin',
    },
    col2Top: {
      title: 'Pure Veg\nThali',
      badge: '₹65 / Meal',
      graphic: <FluentEmoji name="Leafy green" fallback="🥬" size={40} />,
      href: '/listings?category=tiffin&search=veg',
    },
    col2Bottom: {
      title: 'Student Mess\nMonthly Plan',
      badge: '2 Times ₹2,400',
      graphic: <FluentEmoji name="Man student" fallback="👨‍🎓" size={40} />,
      href: '/listings?category=tiffin&search=student-mess',
    },
    col3Top: {
      title: 'Diet & Gym\nMeal Box',
      badge: 'High Protein',
      graphic: <FluentEmoji name="Green salad" fallback="🥗" size={40} />,
      href: '/listings?category=tiffin&search=diet',
    },
    col3Bottom: {
      title: 'Office Lunch\nDelivery',
      badge: 'Hot & On-Time',
      graphic: <FluentEmoji name="Briefcase" fallback="💼" size={40} />,
      href: '/listings?category=tiffin&search=office',
    },
  },
};

/* Tab config with icons + pastel colors for clay pills */
const TAB_CONFIG: { key: TabType; label: string; icon: React.ReactNode; activeColor: string; activeBg: string }[] = [
  { key: 'pg-hostel', label: 'PG/Hostel', icon: <Home className="w-3.5 h-3.5" />, activeColor: 'text-blue-700', activeBg: 'bg-blue-50' },
  { key: 'flats', label: 'Flats', icon: <Building className="w-3.5 h-3.5" />, activeColor: 'text-emerald-700', activeBg: 'bg-emerald-50' },
  { key: 'services', label: 'Services', icon: <Wrench className="w-3.5 h-3.5" />, activeColor: 'text-amber-700', activeBg: 'bg-amber-50' },
  { key: 'tiffin', label: 'Tiffin', icon: <Utensils className="w-3.5 h-3.5" />, activeColor: 'text-rose-700', activeBg: 'bg-rose-50' },
  { key: 'hourly-hotels', label: 'Hotels', icon: <Clock className="w-3.5 h-3.5" />, activeColor: 'text-violet-700', activeBg: 'bg-violet-50' },
];

export function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('pg-hostel');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Connect to shared Zustand category navigation store
  const mobileTab = useCategoryNavStore((s) => s.mobileCategory);
  const setMobileTab = useCategoryNavStore((s) => s.setMobileCategory);

  const theme = CATEGORY_THEMES[mobileTab];
  const currentBento = BENTO_DATA[mobileTab];

  const selectedCity = useLocationStore((s) => s.selectedCity);
  const openSearchModal = useLocationStore((s) => s.openSearchModal);

  // Auto-scroll mobile tab into view so label is never cut off
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const handleMobileTabClick = (key: MobileCategoryKey) => {
    setMobileTab(key);
    const btn = tabRefs.current[key];
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  React.useEffect(() => {
    const btn = tabRefs.current[mobileTab];
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [mobileTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedCategory('all');
    setIsDropdownOpen(false);
  };

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    const effectiveCategory = mobileTab !== 'all' ? mobileTab : activeTab;
    if (effectiveCategory) params.set('category', effectiveCategory);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <header className="relative">

      {/* ═══════════════════════════════════════════════════════════
          ⚡ MOBILE HERO — BLINKIT STYLE WITH SEARCHBOOK CATEGORIES
          Dynamic pastel theme background shifts per selected category
          ═══════════════════════════════════════════════════════════ */}
      <div className={`md:hidden bg-gradient-to-b ${theme.bgGradient} px-3.5 pt-1 pb-5 transition-all duration-500 ease-out`}>

        {/* 1. Blinkit Big White Search Bar (Triggers Mobile Guided Smart Search Modal) */}
        <div className="relative mb-3.5">
          <div 
            onClick={openSearchModal}
            className="bg-white rounded-2xl h-12 px-4 shadow-sm flex items-center justify-between border border-white/80 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2.5 flex-1 mr-2 overflow-hidden">
              <Search className="w-5 h-5 text-gray-800 shrink-0" />
              <span className="text-xs font-semibold text-gray-500 truncate">
                Search PGs, flats, hotels in {selectedCity.name}...
              </span>
            </div>
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                openSearchModal();
              }}
              className="text-gray-800 p-1 active:scale-90 transition-transform cursor-pointer"
            >
              <Mic className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        {/* 2. SearchBook Category Icon Strip (In-place switching, Dynamic Colors & Auto-Scroll) */}
        <div className="flex items-center justify-between gap-1.5 px-1 mb-3.5 overflow-x-auto scrollbar-hide scroll-smooth pr-4">
          {MOBILE_CATEGORY_TABS.map((tab) => {
            const isActive = mobileTab === tab.key;
            return (
              <button 
                key={tab.key}
                ref={(el) => { tabRefs.current[tab.key] = el; }}
                type="button"
                onClick={() => handleMobileTabClick(tab.key)}
                className={`flex flex-col items-center gap-1 cursor-pointer shrink-0 min-w-[52px] transition-all active:scale-95 ${
                  isActive ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center text-gray-900">
                  {tab.icon}
                </div>
                <span className={`text-[11px] leading-none transition-colors duration-300 ${
                  isActive ? `font-black ${theme.activePillText}` : 'font-bold text-gray-700'
                }`}>
                  {tab.label}
                </span>
                {/* Dynamic Theme underline indicator */}
                <div className={`w-6 h-[3px] rounded-full mt-1 transition-all duration-300 ${
                  isActive ? `${theme.indicatorColor} scale-100` : 'bg-transparent scale-0'
                }`} />
              </button>
            );
          })}
        </div>

        {/* 3. SearchBook Hero Banner (Dynamic based on selected category & theme) */}
        <div 
          key={`banner-${mobileTab}`}
          className={`relative rounded-2xl overflow-hidden mb-3.5 bg-gradient-to-r ${theme.bannerGradient} p-3.5 min-h-[82px] flex items-center border border-white/60 shadow-2xs transition-all duration-500 animate-in fade-in`}
        >
          <div className="flex items-center justify-between relative z-10 w-full">
            <div>
              <p className={`text-[9.5px] font-display font-black tracking-[0.18em] ${theme.bannerTagText} uppercase mb-0.5`}>
                {currentBento.banner.tag}
              </p>
              <h3 className={`text-[20px] font-display font-black tracking-tight ${theme.bannerTitleText} leading-tight mt-0.5 clay-title`}>
                {currentBento.banner.title}
              </h3>
              <p className={`text-[10.5px] ${theme.bannerTagText} font-medium mt-0.5`}>
                {currentBento.banner.subtitle}
              </p>
            </div>

            {/* City Living Artwork */}
            <div className="flex items-center gap-1.5 shrink-0">
              {currentBento.banner.icons.map((icon, idx) => (
                <span key={idx} className={`text-2xl ${idx === 0 ? 'animate-bounce' : idx === 1 ? 'text-3xl' : ''}`}>
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Jewel-Tone 3D Bento Grid (Distinct Card Identities, Depth & Specular Highlights) */}
        <div key={`bento-${mobileTab}`} className="grid grid-cols-3 gap-2 animate-in fade-in duration-200">
          
          {/* ── COLUMN 1: Tall Card ── */}
          <Link
            href={currentBento.tallCard.href}
            className={`${currentBento.tallCard.bgGradient || theme.bentoBg} rounded-[24px] p-3 flex flex-col justify-between text-white border border-white/30 shadow-[0_12px_24px_-6px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,0.4)] overflow-hidden h-[230px] relative active:scale-95 transition-all duration-300 hover:shadow-xl group backdrop-blur-md`}
          >
            <div className="relative z-10">
              <h4 className="text-[13.5px] font-display font-black text-white leading-tight whitespace-pre-line drop-shadow-sm">
                {currentBento.tallCard.title}
              </h4>

              <div className="mt-2.5">
                <div className="bg-white/95 text-slate-900 font-display font-black text-[11px] px-2.5 py-0.5 rounded-full inline-flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                  {currentBento.tallCard.priceBadge}
                </div>
              </div>
            </div>

            {/* Bottom Graphic with Glow Effect */}
            <div className="mt-auto flex justify-center py-1 relative z-10">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] transform group-hover:scale-110 transition-transform duration-300">
                {currentBento.tallCard.graphic}
              </div>
            </div>
            
            {/* Ambient Lighting Accents */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none rounded-[24px]" />
          </Link>

          {/* ── COLUMN 2: 2 Stacked Cards ── */}
          <div className="flex flex-col gap-2">
            {/* Top Card */}
            <Link
              href={currentBento.col2Top.href}
              className={`${currentBento.col2Top.bgGradient || theme.bentoBg} rounded-[24px] p-2.5 flex flex-col justify-between text-white border border-white/30 shadow-[0_10px_20px_-6px_rgba(0,0,0,0.16),inset_0_1.5px_1px_rgba(255,255,255,0.4)] overflow-hidden h-[111px] relative active:scale-95 transition-all duration-300 hover:shadow-xl group backdrop-blur-md`}
            >
              <div className="relative z-10">
                <h4 className="text-[11.5px] font-display font-black text-white leading-tight whitespace-pre-line drop-shadow-sm">
                  {currentBento.col2Top.title}
                </h4>
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/25 text-[9px] font-display font-black text-white tracking-tight shadow-xs">
                    {currentBento.col2Top.badge || currentBento.col2Top.price}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex justify-center py-0.5 relative z-10">
                <div className="text-2xl filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)] transform group-hover:scale-110 transition-transform duration-300">
                  {currentBento.col2Top.graphic}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/15 rounded-full blur-lg pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none rounded-[24px]" />
            </Link>

            {/* Bottom Card */}
            <Link
              href={currentBento.col2Bottom.href}
              className={`${currentBento.col2Bottom.bgGradient || theme.bentoBg} rounded-[24px] p-2.5 flex flex-col justify-between text-white border border-white/30 shadow-[0_10px_20px_-6px_rgba(0,0,0,0.16),inset_0_1.5px_1px_rgba(255,255,255,0.4)] overflow-hidden h-[111px] relative active:scale-95 transition-all duration-300 hover:shadow-xl group backdrop-blur-md`}
            >
              <div className="relative z-10">
                <h4 className="text-[11.5px] font-display font-black text-white leading-tight whitespace-pre-line drop-shadow-sm">
                  {currentBento.col2Bottom.title}
                </h4>
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/25 text-[9px] font-display font-black text-white tracking-tight shadow-xs">
                    {currentBento.col2Bottom.badge || currentBento.col2Bottom.price}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex justify-center py-0.5 relative z-10">
                <div className="text-2xl filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)] transform group-hover:scale-110 transition-transform duration-300">
                  {currentBento.col2Bottom.graphic}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/15 rounded-full blur-lg pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none rounded-[24px]" />
            </Link>
          </div>

          {/* ── COLUMN 3: 2 Stacked Cards ── */}
          <div className="flex flex-col gap-2">
            {/* Top Card */}
            <Link
              href={currentBento.col3Top.href}
              className={`${currentBento.col3Top.bgGradient || theme.bentoBg} rounded-[24px] p-2.5 flex flex-col justify-between text-white border border-white/30 shadow-[0_10px_20px_-6px_rgba(0,0,0,0.16),inset_0_1.5px_1px_rgba(255,255,255,0.4)] overflow-hidden h-[111px] relative active:scale-95 transition-all duration-300 hover:shadow-xl group backdrop-blur-md`}
            >
              <div className="relative z-10">
                <h4 className="text-[11.5px] font-display font-black text-white leading-tight whitespace-pre-line drop-shadow-sm">
                  {currentBento.col3Top.title}
                </h4>
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/25 text-[9px] font-display font-black text-white tracking-tight shadow-xs">
                    {currentBento.col3Top.badge || currentBento.col3Top.price}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex justify-center py-0.5 relative z-10">
                <div className="text-2xl filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)] transform group-hover:scale-110 transition-transform duration-300">
                  {currentBento.col3Top.graphic}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/15 rounded-full blur-lg pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none rounded-[24px]" />
            </Link>

            {/* Bottom Card */}
            <Link
              href={currentBento.col3Bottom.href}
              className={`${currentBento.col3Bottom.bgGradient || theme.bentoBg} rounded-[24px] p-2.5 flex flex-col justify-between text-white border border-white/30 shadow-[0_10px_20px_-6px_rgba(0,0,0,0.16),inset_0_1.5px_1px_rgba(255,255,255,0.4)] overflow-hidden h-[111px] relative active:scale-95 transition-all duration-300 hover:shadow-xl group backdrop-blur-md`}
            >
              <div className="relative z-10">
                <h4 className="text-[11.5px] font-display font-black text-white leading-tight whitespace-pre-line drop-shadow-sm">
                  {currentBento.col3Bottom.title}
                </h4>
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/25 text-[9px] font-display font-black text-white tracking-tight shadow-xs">
                    {currentBento.col3Bottom.badge || currentBento.col3Bottom.price}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex justify-center py-0.5 relative z-10">
                <div className="text-2xl filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)] transform group-hover:scale-110 transition-transform duration-300">
                  {currentBento.col3Bottom.graphic}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/15 rounded-full blur-lg pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none rounded-[24px]" />
            </Link>
          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════
          🖥️ DESKTOP HERO — Original blue design
          ═══════════════════════════════════════════ */}
      <div className="hidden md:block bg-[#0033CC]">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto block" preserveAspectRatio="none">
              <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#f8fafc" />
            </svg>
          </div>
        </div>

        <div className="relative z-30 max-w-7xl mx-auto px-8 pt-14 pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

            {/* Left Column */}
            <div className="flex flex-col items-start z-10 w-full">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                Trusted by 10K+ Gen-Z & Professionals
              </div>

              <h1 className="text-[clamp(2.2rem,3.8vw,3.2rem)] font-black text-white leading-[1.15] tracking-tight text-left w-full whitespace-nowrap">
                <span className="block">Find PG, Hostels, Flats</span>
                <span className="block text-[#CCFF00]">& Everyday Services</span>
                <span className="block">Near You</span>
              </h1>

              <p className="text-base text-white/80 mt-4 max-w-md font-medium leading-relaxed text-left">
                Verified listings. Trusted owners. Hassle-free living.
              </p>

              {/* Desktop Search Box */}
              <div className="mt-8 w-full max-w-lg bg-white rounded-2xl p-2.5 shadow-2xl">
                <div className="flex p-1 bg-gray-50 rounded-xl mb-2 border border-gray-100 overflow-x-auto scrollbar-hide">
                  {TAB_CONFIG.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleTabChange(tab.key)}
                      className={`flex-1 min-w-[65px] py-2 px-2 font-bold text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === tab.key
                          ? 'bg-[#0033CC] text-white shadow-md'
                          : 'text-gray-500 hover:text-[#0033CC] hover:bg-[#E6F0FF]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-row gap-2 relative">
                  <LocationAutocomplete />

                  <div className="relative flex-1">
                    <Grid className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-50 text-black text-xs font-semibold border border-gray-100 focus:bg-white focus:border-[#0033CC]/30 focus:outline-none transition-all cursor-pointer text-left flex items-center justify-between"
                    >
                      <span className="text-black">
                        {categoryOptions[activeTab].find(o => o.value === selectedCategory)?.label || 'All'}
                      </span>
                      <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute bottom-full left-0 w-full mb-2 liquid-glass-dropdown z-50 p-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-2xl">
                        {categoryOptions[activeTab].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSelectedCategory(opt.value);
                              setIsDropdownOpen(false);
                              const params = new URLSearchParams();
                              params.set('category', activeTab);
                              if (opt.value !== 'all') params.set('search', opt.label);
                              router.push(`/listings?${params.toString()}`);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                              selectedCategory === opt.value
                                ? 'bg-[#0033CC] text-white shadow-xs'
                                : 'text-gray-800 hover:bg-blue-50/80 hover:text-[#0033CC]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSearchClick}
                    className="bg-[#0033CC] text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#002299] transition-colors flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column Image */}
            <div className="relative hidden lg:block h-[420px] xl:h-[480px] w-full rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white/10 z-10">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
                alt="Premium Living Space"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0033CC]/40 to-transparent mix-blend-multiply" />
              <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-[200px] border border-white cursor-default">
                <div className="w-8 h-8 bg-[#E6F0FF] rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0033CC]" />
                </div>
                <h4 className="font-bold text-black text-sm mb-1">Premium Living</h4>
                <p className="text-xs text-gray-500 font-medium mb-3">Handpicked Spaces</p>
                <button className="text-[10px] font-bold text-[#0033CC] border border-[#0033CC] rounded-full px-3 py-1.5 hover:bg-[#0033CC] hover:text-white transition-colors cursor-pointer">
                  Explore Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </header>
  );
}
