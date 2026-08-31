'use client';

import React, { useState } from 'react';
import { Search, MapPin, Grid, CheckCircle2 } from 'lucide-react';
import { LocationAutocomplete } from '@frontend/components/home/LocationAutocomplete';

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

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<TabType>('pg-hostel');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reset category when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedCategory('all');
    setIsDropdownOpen(false);
  };

  return (
    <header className="relative bg-[#0033CC]">
      {/* Background Layer (Contains overflow so glow effects don't cause horizontal scroll) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Glow effects */}
        <div className="absolute top-[-100px] right-[-50px] w-[500px] h-[500px] bg-[#CCFF00] rounded-full opacity-[0.08] blur-[120px]" />
        <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] bg-cyan-400 rounded-full opacity-[0.06] blur-[100px]" />
        
        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-5 md:px-8 pt-10 pb-32 md:pt-14 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Text & Search */}
          <div className="flex flex-col items-start z-10 w-full">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
              Trusted by 10K+ Gen-Z & Professionals
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.2rem,3.8vw,3.2rem)] font-black text-white leading-[1.15] tracking-tight text-left w-full whitespace-nowrap">
              <span className="block">Find PG, Hostels, Flats</span>
              <span className="block text-[#CCFF00]">& Everyday Services</span>
              <span className="block">Near You</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-white/80 mt-4 max-w-md font-medium leading-relaxed text-left">
              Verified listings. Trusted owners. Hassle-free living.
            </p>

            {/* Advanced Search Box */}
            <div className="mt-8 w-full max-w-lg bg-white rounded-2xl p-2.5 shadow-2xl">
              {/* Tabs */}
              <div className="flex p-1 bg-gray-50 rounded-xl mb-2 border border-gray-100 overflow-x-auto scrollbar-hide">
                <button 
                  onClick={() => handleTabChange('pg-hostel')}
                  className={`flex-1 min-w-[75px] py-2 px-2 font-bold text-[11px] sm:text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'pg-hostel' 
                      ? 'bg-[#0033CC] text-white shadow-md' 
                      : 'text-gray-500 hover:text-[#0033CC] hover:bg-[#E6F0FF]'
                  }`}
                >
                  PG / Hostel
                </button>
                <button 
                  onClick={() => handleTabChange('flats')}
                  className={`flex-1 min-w-[55px] py-2 px-2 font-bold text-[11px] sm:text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'flats' 
                      ? 'bg-[#0033CC] text-white shadow-md' 
                      : 'text-gray-500 hover:text-[#0033CC] hover:bg-[#E6F0FF]'
                  }`}
                >
                  Flats
                </button>
                <button 
                  onClick={() => handleTabChange('services')}
                  className={`flex-1 min-w-[65px] py-2 px-2 font-bold text-[11px] sm:text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'services' 
                      ? 'bg-[#0033CC] text-white shadow-md' 
                      : 'text-gray-500 hover:text-[#0033CC] hover:bg-[#E6F0FF]'
                  }`}
                >
                  Services
                </button>
                <button 
                  onClick={() => handleTabChange('tiffin')}
                  className={`flex-1 min-w-[75px] py-2 px-2 font-bold text-[11px] sm:text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'tiffin' 
                      ? 'bg-[#0033CC] text-white shadow-md' 
                      : 'text-gray-500 hover:text-[#0033CC] hover:bg-[#E6F0FF]'
                  }`}
                >
                  Mess/Tiffin
                </button>
                <button 
                  onClick={() => handleTabChange('hourly-hotels')}
                  className={`flex-1 min-w-[85px] py-2 px-2 font-bold text-[11px] sm:text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'hourly-hotels' 
                      ? 'bg-[#0033CC] text-white shadow-md' 
                      : 'text-gray-500 hover:text-[#0033CC] hover:bg-[#E6F0FF]'
                  }`}
                >
                  Hourly Hotels
                </button>
              </div>

              {/* Inputs Row */}
              <div className="flex flex-col md:flex-row gap-2 relative">
                
                {/* Location Input */}
                <LocationAutocomplete />

                {/* Custom Glassmorphic Category Dropdown */}
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

                  {/* Dropdown Menu - Opens UPWARDS with Glass Effect */}
                  {isDropdownOpen && (
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden z-50 p-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      {categoryOptions[activeTab].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedCategory(opt.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                            selectedCategory === opt.value 
                              ? 'bg-[#0033CC] text-white shadow-sm' 
                              : 'text-gray-700 hover:bg-white hover:text-[#0033CC]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="bg-[#0033CC] text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#002299] transition-colors flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer">
                  <Search className="w-3.5 h-3.5" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative hidden lg:block h-[420px] xl:h-[480px] w-full rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white/10 z-10">
            <img 
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" 
              alt="Premium Living Space" 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay for better contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0033CC]/40 to-transparent mix-blend-multiply" />
            
            {/* Floating Badge */}
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

    </header>
  );
}
