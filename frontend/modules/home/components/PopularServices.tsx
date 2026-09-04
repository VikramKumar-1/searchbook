/**
 * @file PopularServices.tsx
 * @description Popular Home & Life Services component.
 * 
 * Responsive Layout:
 * - Mobile: Uses a horizontal scrolling row (mobile-scroll-x) displaying 
 *   services as compact circular icons (Blinkit-style) for easy touch interaction.
 * - Desktop: Displays a 4-column grid of rich gradient cards with 3D characters 
 *   and glassmorphism elements.
 */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Global memory cache for transparent character dataURLs
const imageCache = new Map<string, string>();

// Fallback component to convert JPG to transparent PNG and save to /public/services
function AutoGenerateTransparentImage({
  jpgSrc,
  name,
  alt,
  className,
  onSaved,
}: {
  jpgSrc: string;
  name: string;
  alt: string;
  className?: string;
  onSaved: () => void;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.src = jpgSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const MAX_DIM = 320;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        const corners = [
          0,
          Math.max(0, (width - 1) * 4),
          Math.max(0, (height - 1) * width * 4),
          Math.max(0, ((height - 1) * width + (width - 1)) * 4),
        ];
        let bgR = 0, bgG = 0, bgB = 0;
        for (const c of corners) {
          bgR += d[c];
          bgG += d[c + 1];
          bgB += d[c + 2];
        }
        bgR = Math.round(bgR / 4);
        bgG = Math.round(bgG / 4);
        bgB = Math.round(bgB / 4);

        const CUTOFF_SQ = 55 * 55;
        const FEATHER_SQ = 95 * 95;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          const distBgSq = (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;
          const distWhiteSq = (r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2;
          const minDistSq = Math.min(distBgSq, distWhiteSq);
          const isNearWhite = r >= 220 && g >= 220 && b >= 220;

          if (minDistSq <= CUTOFF_SQ || isNearWhite) {
            d[i + 3] = 0;
          } else if (minDistSq < FEATHER_SQ) {
            const dist = Math.sqrt(minDistSq);
            const alpha = (dist - 55) / 40;
            d[i + 3] = Math.min(255, Math.max(0, Math.round(d[i + 3] * alpha)));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultUrl = canvas.toDataURL('image/png');
        setDataUrl(resultUrl);

        // Send to backend dev API to write physical .png file to public/services/
        fetch('/api/dev/save-transparent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, base64: resultUrl }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.success) {
              onSaved();
            }
          })
          .catch(() => {});
      } catch {
        setDataUrl(jpgSrc);
      }
    };
  }, [jpgSrc, name, onSaved]);

  return (
    <img
      src={dataUrl || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
      alt={alt}
      className={`${className} ${dataUrl ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
    />
  );
}

function TransparentServiceImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [pngAvailable, setPngAvailable] = useState<boolean>(true);

  if (pngAvailable) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        onError={() => {
          // If PNG not found yet, auto-convert and save
          setPngAvailable(false);
        }}
      />
    );
  }

  const name = src.replace('/services/', '').replace('.png', '').replace('.jpg', '');
  const jpgSrc = `/services/${name}.jpg`;

  return (
    <AutoGenerateTransparentImage
      jpgSrc={jpgSrc}
      name={name}
      alt={alt}
      className={className}
      onSaved={() => setPngAvailable(true)}
    />
  );
}

const services = [
  { 
    title: 'Housemaid & Maid',
    categorySlug: 'maid',
    imgSrc: '/services/maid.png',
    gradient: 'from-rose-400 to-pink-500',
  },
  { 
    title: 'Home Cook & Chef',
    categorySlug: 'home-cook',
    imgSrc: '/services/cook.png',
    gradient: 'from-orange-400 to-red-500',
  },
  { 
    title: '20L Water Supply',
    categorySlug: 'water-supply',
    imgSrc: '/services/water.png',
    gradient: 'from-sky-400 to-blue-600',
  },
  { 
    title: 'Wash & Steam Iron',
    categorySlug: 'laundry',
    imgSrc: '/services/laundry.png',
    gradient: 'from-violet-400 to-purple-600',
  },
  { 
    title: 'Plumbing & Repairs',
    categorySlug: 'plumber',
    imgSrc: '/services/plumber.png',
    gradient: 'from-slate-400 to-slate-600',
  },
  { 
    title: 'Wiring & Electrical',
    categorySlug: 'electrician',
    imgSrc: '/services/electrician.png',
    gradient: 'from-amber-400 to-orange-500',
  },
  { 
    title: 'AC Deep Service',
    categorySlug: 'ac-repair',
    imgSrc: '/services/ac.png',
    gradient: 'from-cyan-400 to-teal-500',
  },
  { 
    title: 'LPG Gas Supply',
    categorySlug: 'gas-delivery',
    imgSrc: '/services/gas.png',
    gradient: 'from-rose-500 to-red-600',
  },
];

export function PopularServices() {
  /* Liquid glass pastel tint classes matching each gradient */
  const liquidTints = [
    'liquid-glass-pastel-warm',    // Housemaid - rose/pink
    'liquid-glass-pastel-warm',    // Cook - orange/red
    'liquid-glass-pastel-blue',    // Water - sky/blue
    'liquid-glass-pastel-purple',  // Laundry - violet/purple
    'liquid-glass-droplet',        // Plumber - crystal
    'liquid-glass-pastel-warm',    // Electrician - amber/orange
    'liquid-glass-pastel-mint',    // AC - cyan/teal
    'liquid-glass-pastel-warm',    // Gas - rose/red
  ];

  return (
    <section className="liquid-bg-sky md:bg-[#FAFBFD] py-6 md:py-16 px-4 md:px-8 border-t border-white/80 md:border-gray-100/80">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-4 md:mb-8">
          <div>
            <p className="text-[10px] md:text-xs font-black text-[#0033CC] uppercase tracking-widest mb-1">Everyday Essentials</p>
            <h2 className="text-xl md:text-4xl font-black text-[#0f172a] tracking-tight">
              Popular Services
            </h2>
          </div>
          <Link href="/listings" className="text-sm font-bold text-[#0033CC] hover:underline hidden md:block">
            See all →
          </Link>
        </div>

        {/* ═══ MOBILE LAYOUT — Blinkit-style Liquid Glass Bento Grid ═══ */}
        <div className="md:hidden grid grid-cols-2 gap-2.5">
          {services.map((service, index) => (
            <Link
              key={index}
              href={`/listings?category=${service.categorySlug}`}
              className={`${liquidTints[index] || 'liquid-glass-pastel-blue'} p-3.5 flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-transform min-h-[114px]`}
            >
              {/* Gradient bubble with 3D character */}
              <div className={`w-13 h-13 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center overflow-hidden relative border-2 border-white shadow-md`}
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.12)',
                }}
              >
                <TransparentServiceImage
                  src={service.imgSrc}
                  alt={service.title}
                  className="h-[135%] w-auto object-contain drop-shadow-sm mt-1.5"
                />
              </div>
              <h3 className="text-center text-[11px] font-bold text-gray-900 leading-tight line-clamp-2">
                {service.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* ═══ DESKTOP LAYOUT — 4-col gradient cards (unchanged) ═══ */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
          {services.map((service, index) => (
            <Link
              key={index}
              href={`/listings?category=${service.categorySlug}`}
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
            </Link>
          ))}
        </div>

        {/* Mobile View All — Liquid Glass */}
        <Link href="/listings" className="mt-3 flex md:hidden items-center justify-center gap-1.5 text-xs font-bold text-[#0033CC] liquid-glass py-2.5 active:scale-[0.97] transition-transform">
          Explore All Services →
        </Link>

      </div>
    </section>
  );
}

