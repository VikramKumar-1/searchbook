import React from 'react';
import { ArrowRight } from 'lucide-react';

const cities = [
  { 
    name: 'Delhi NCR', 
    slug: 'delhi-ncr', 
    tag: 'Top Rated', 
    subtext: 'Capital City • Fast Paced',
    listings: '12,500+ Listings',
    // India Gate Sunset
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Gurugram', 
    slug: 'gurugram', 
    tag: 'Trending', 
    subtext: 'Cyber City • Corporate Hub',
    listings: '8,200+ Listings',
    // DLF Cyber Hub & Skyline
    img: '/cities/gurugram.jpg' 
  },
  { 
    name: 'Noida', 
    slug: 'noida', 
    tag: 'Popular', 
    subtext: 'Tech City • Expressway & Hubs',
    listings: '9,100+ Listings',
    // Noida Expressway & Highrises
    img: '/cities/noida.jpg' 
  },
  { 
    name: 'Ranchi', 
    slug: 'ranchi', 
    tag: 'Emerging', 
    subtext: 'City of Waterfalls & Hills',
    listings: '3,400+ Listings',
    // Jagannath Temple & Hilltop
    img: '/cities/ranchi.jpg' 
  }
];

export function CitiesSection() {
  return (
    <section className="bg-white py-16 px-5 md:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Explore Top Cities
            </h2>
          </div>
          <a href="/cities" className="hidden md:flex items-center gap-1 text-sm font-bold text-[#0033CC] hover:text-[#002299] transition-colors group">
            View All Cities
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grid: 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {cities.map((city) => (
            <a
              key={city.slug}
              href={`/city/${city.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[4/5] lg:h-[360px] flex flex-col shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Background Image Optimized */}
              <img 
                src={city.img} 
                alt={city.name} 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 group-hover:to-black transition-colors duration-500" />
              
              {/* Top Tag */}
              <div className="absolute top-4 left-4 z-10 transform -translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="bg-white text-[#0033CC] text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {city.tag}
                </span>
              </div>

              {/* Bottom Content with slight upward animation */}
              <div className="mt-auto relative z-10 p-5 w-full flex flex-col transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-black text-white mb-1 leading-none tracking-tight drop-shadow-md">
                  {city.name}
                </h3>
                
                <p className="text-sm text-gray-200 font-medium mb-3 opacity-90">
                  {city.subtext}
                </p>
                
                <div className="w-full h-px bg-white/20 mb-3 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                
                <p className="text-[13px] font-semibold text-[#CCFF00] drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {city.listings}
                </p>
              </div>
            </a>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <a href="/cities" className="mt-6 flex md:hidden items-center justify-center gap-1 text-sm font-bold text-[#0033CC] bg-[#E6F0FF] py-3 rounded-xl active:scale-95 transition-transform">
          View All Cities
          <ArrowRight className="w-4 h-4" />
        </a>

      </div>
    </section>
  );
}
