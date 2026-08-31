"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

// Client-side automatic background stripper to render 100% transparent PNGs
function TransparentServiceImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setDataUrl(src);
          return;
        }

        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        // Sample corner background color
        const bgR = (d[0] + d[(canvas.width - 1) * 4]) / 2;
        const bgG = (d[1] + d[(canvas.width - 1) * 4 + 1]) / 2;
        const bgB = (d[2] + d[(canvas.width - 1) * 4 + 2]) / 2;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          // Color distance from background & pure white
          const distBg = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
          const distWhite = Math.sqrt((r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2);
          const minDist = Math.min(distBg, distWhite);

          if (minDist < 36) {
            d[i + 3] = 0; // 100% Transparent
          } else if (minDist < 62) {
            // Smooth edge anti-aliasing
            const alpha = (minDist - 36) / 26;
            d[i + 3] = Math.round(d[i + 3] * alpha);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setDataUrl(canvas.toDataURL('image/png'));
      } catch {
        setDataUrl(src);
      }
    };

    img.onerror = () => {
      setDataUrl(src);
    };
  }, [src]);

  return (
    <img
      src={dataUrl || src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

const services = [
  { 
    title: 'Housemaid & Maid',
    imgSrc: '/services/maid.jpg',
    gradient: 'from-rose-400 to-pink-500',
  },
  { 
    title: 'Home Cook & Chef',
    imgSrc: '/services/cook.jpg',
    gradient: 'from-orange-400 to-red-500',
  },
  { 
    title: '20L Water Supply',
    imgSrc: '/services/water.jpg',
    gradient: 'from-sky-400 to-blue-600',
  },
  { 
    title: 'Wash & Steam Iron',
    imgSrc: '/services/laundry.jpg',
    gradient: 'from-violet-400 to-purple-600',
  },
  { 
    title: 'Plumbing & Repairs',
    imgSrc: '/services/plumber.jpg',
    gradient: 'from-slate-400 to-slate-600',
  },
  { 
    title: 'Wiring & Electrical',
    imgSrc: '/services/electrician.jpg',
    gradient: 'from-amber-400 to-orange-500',
  },
  { 
    title: 'AC Deep Service',
    imgSrc: '/services/ac.jpg',
    gradient: 'from-cyan-400 to-teal-500',
  },
  { 
    title: 'LPG Gas Supply',
    imgSrc: '/services/gas.jpg',
    gradient: 'from-rose-500 to-red-600',
  },
];

export function PopularServices() {
  return (
    <section className="bg-[#FAFBFD] py-12 md:py-16 px-5 md:px-8 border-t border-gray-100/80">

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#0033CC] uppercase tracking-widest mb-1.5">Everyday Essentials</p>
            <h2 className="text-2xl md:text-4xl font-black text-[#0f172a] tracking-tight">
              Popular Home & Life Services
            </h2>
          </div>
          <a href="/services" className="text-sm font-bold text-[#0033CC] hover:underline hidden md:block">
            See all →
          </a>
        </div>

        {/* Grid: 4 columns desktop, 2 columns mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
          {services.map((service, index) => (
            <a
              key={index}
              href={`/service/${service.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              className={`group relative flex flex-col items-center justify-end bg-gradient-to-br ${service.gradient} rounded-2xl md:rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer h-[155px] md:h-[180px] border-4 border-white/20 hover:border-white/40 shadow-lg`}
            >
              {/* Centered Transparent 3D Character */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-1 pb-9 md:pb-10">
                <TransparentServiceImage 
                  src={service.imgSrc} 
                  alt={service.title} 
                  className="h-full w-auto object-contain scale-110 group-hover:scale-[1.2] transition-transform duration-500 drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)] contrast-[1.05]"
                />
              </div>

              {/* Title — Frosted Glass Pill at Bottom */}
              <div className="relative z-10 flex justify-center pb-2.5 md:pb-3 px-2">
                <h3 className="text-center text-white text-[11px] md:text-[13px] font-bold tracking-wide bg-white/15 backdrop-blur-md rounded-xl py-1.5 px-3 border border-white/20 drop-shadow-sm">
                  {service.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile View All */}
        <a href="/services" className="mt-6 flex md:hidden items-center justify-center gap-1.5 text-sm font-bold text-[#0033CC] bg-white border border-gray-200 py-3 rounded-2xl active:scale-95 transition-transform shadow-sm">
          Explore All Services →
        </a>

      </div>
    </section>
  );
}
