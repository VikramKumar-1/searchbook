/**
 * @file CitiesSection.tsx
 * @description Renders a section showcasing top cities.
 * Uses a horizontal scroll layout on mobile devices (`mobile-scroll-x`) 
 * and a CSS grid on desktop devices.
 */
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const cities = [
  { 
    name: 'Ranchi', 
    slug: 'ranchi', 
    tag: 'Flagship Hub', 
    subtext: 'City of Waterfalls & Hills',
    listings: '3,400+ Listings',
    img: '/cities/ranchi.jpg' 
  },
  { 
    name: 'Patna', 
    slug: 'patna', 
    tag: 'Mid-Town Hub', 
    subtext: 'Historic & Education Center',
    listings: '4,100+ Listings',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Delhi NCR', 
    slug: 'delhi', 
    tag: 'Top Rated', 
    subtext: 'Capital City • Fast Paced',
    listings: '12,500+ Listings',
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Bengaluru', 
    slug: 'bengaluru', 
    tag: 'Tech Metro', 
    subtext: 'Silicon Valley of India',
    listings: '14,200+ Listings',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Mumbai', 
    slug: 'mumbai', 
    tag: 'Financial Hub', 
    subtext: 'City of Dreams & Stays',
    listings: '15,800+ Listings',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Pune', 
    slug: 'pune', 
    tag: 'Student City', 
    subtext: 'Oxford of the East & IT',
    listings: '9,400+ Listings',
    img: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Hyderabad', 
    slug: 'hyderabad', 
    tag: 'Cyberabad', 
    subtext: 'Hitec City & Heritage Living',
    listings: '8,900+ Listings',
    img: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Dehradun', 
    slug: 'dehradun', 
    tag: 'Valley Hub', 
    subtext: 'Scenic Valley & Stays',
    listings: '2,900+ Listings',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Gurugram', 
    slug: 'gurugram', 
    tag: 'Trending', 
    subtext: 'Cyber City • Corporate Hub',
    listings: '8,200+ Listings',
    img: '/cities/gurugram.jpg' 
  },
  { 
    name: 'Noida', 
    slug: 'noida', 
    tag: 'Popular', 
    subtext: 'Tech City • Expressway & Hubs',
    listings: '9,100+ Listings',
    img: '/cities/noida.jpg' 
  }
];

export function CitiesSection() {
  return (
    <section className="clay-bg-warm md:bg-white py-6 md:py-16 px-4 md:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8">
          <div>
            <h2 className="text-lg md:text-3xl font-black text-gray-900 tracking-tight">
              Explore Top Cities
            </h2>
          </div>
          <Link href="/cities" className="hidden md:flex items-center gap-1 text-sm font-bold text-[#0033CC] hover:text-[#002299] transition-colors group">
            View All Cities
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ═══ MOBILE LAYOUT — Liquid Glass Horizontal scroll ═══ */}
        <div className="md:hidden mobile-scroll-x will-change-scroll px-4 -mx-4 flex gap-3.5 pb-2">
          {cities.map((city) => (
            <Link key={city.slug} href={`/city/${city.slug}`}
               className="w-[190px] aspect-[3/4] shrink-0 relative rounded-[1.5rem] overflow-hidden flex flex-col border-2 border-white shadow-md active:scale-95 transition-transform">
              <img src={city.img} alt={city.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
              
              {/* Top Tag — Liquid Pill */}
              <div className="absolute top-3 left-3 z-10">
                <span className="liquid-glass-pill text-[#0033CC] text-[10px] font-black px-2.5 py-0.5 shadow-xs">{city.tag}</span>
              </div>

              {/* Bottom Info — Frosted Liquid Glass Card */}
              <div className="mt-auto relative z-10 m-2 p-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20">
                <h3 className="text-sm font-black text-white leading-none tracking-tight">{city.name}</h3>
                <p className="text-[10px] text-gray-300 font-medium mt-1 truncate">{city.subtext}</p>
                <p className="text-[10px] font-extrabold text-[#CCFF00] mt-1.5 flex items-center gap-1">
                  <span>⚡</span> {city.listings}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ═══ DESKTOP LAYOUT — Grid ═══ */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cities.map((city) => (
            <Link
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
            </Link>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <Link href="/cities" className="mt-6 flex md:hidden items-center justify-center gap-1 text-sm font-bold text-[#0033CC] bg-[#E6F0FF] py-3 rounded-xl active:scale-95 transition-transform">
          View All Cities
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>
    </section>
  );
}
