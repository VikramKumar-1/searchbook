import React from 'react';
import { ArrowRight, Building, Home, Utensils } from 'lucide-react';
import Image from 'next/image';

const essentials = [
  {
    id: 'pg-hostel',
    title: 'Hostels & PGs',
    badge: 'Verified Stays',
    description: 'Find safe, premium stays with food & Wi-Fi.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    color: 'bg-indigo-500',
    colSpan: 'lg:col-span-2 lg:row-span-2', // Large bento block
    icon: Home,
  },
  {
    id: 'flats',
    title: 'Flats & Rooms',
    badge: 'Brokerage Free',
    description: '', // Removed for minimal UI
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    color: 'bg-emerald-500',
    colSpan: 'lg:col-span-1 lg:row-span-1', // Small top right
    icon: Building,
  },
  {
    id: 'tiffin',
    title: 'Tiffin & Mess',
    badge: 'Fresh Meals',
    description: '', // Removed for minimal UI
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop',
    color: 'bg-orange-500',
    colSpan: 'lg:col-span-1 lg:row-span-1', // Small bottom right
    icon: Utensils,
  },
];

export function EssentialNeeds() {
  return (
    <section className="bg-white py-12 md:py-16 px-5 md:px-8 border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1.5">Most Important</p>
            <h2 className="text-2xl md:text-4xl font-black text-[#0f172a] tracking-tight">
              Top Student & Bachelor Needs
            </h2>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 md:gap-5 min-h-[400px] lg:min-h-[500px]">
          {essentials.map((item) => (
            <a
              key={item.id}
              href={`/category/${item.id}`}
              className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${item.colSpan} flex flex-col justify-end min-h-[200px] sm:min-h-[250px] lg:min-h-0`}
            >
              {/* Background Image & Overlay */}
              <div className="absolute inset-0">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Minimal Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-5 md:p-7 w-full flex flex-col items-start h-full justify-between">
                
                {/* Top Pill Badge */}
                <div className={`${item.color} text-white px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-md bg-opacity-90`}>
                  <item.icon className="w-3.5 h-3.5" />
                  {item.badge}
                </div>

                {/* Bottom Minimal Text */}
                <div className="mt-auto w-full">
                  <h3 className="text-xl md:text-3xl font-black text-white mb-1 leading-tight drop-shadow-md group-hover:-translate-y-1 transition-transform">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-white/80 text-sm font-medium line-clamp-1 max-w-xs group-hover:-translate-y-1 transition-transform delay-75 mb-2">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Explore Link - Visible only on hover */}
                  <div className={`flex items-center gap-1.5 text-white font-bold text-sm opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${item.description ? 'mt-3' : 'mt-2'}`}>
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
