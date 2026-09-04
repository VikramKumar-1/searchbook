/**
 * ═══════════════════════════════════════════════════════════
 * 📣 CTA SECTION — Partner Registration
 * ═══════════════════════════════════════════════════════════
 *
 * 📱 Mobile: Clay-card-dark with puffy button, rounded-3xl
 * 🖥️ Desktop: Full blue bg with glow
 * ═══════════════════════════════════════════════════════════
 */

import React from 'react';

export function CTASection() {
  return (
    <>
      {/* ═══ MOBILE CTA — Clay dark card ═══ */}
      <section className="md:hidden px-4 py-6 clay-bg-blue">
        <div className="clay-card-dark p-6 text-center overflow-hidden relative" style={{ borderRadius: '1.5rem' }}>
          <h2 className="text-xl font-black text-white tracking-tight leading-[1.15] mb-2">
            Ready to grow your<br /><span className="text-[#CCFF00]">local business?</span>
          </h2>
          <p className="text-[11px] text-white/40 font-medium mb-4 max-w-xs mx-auto">
            List your PG, restaurant, or service for free and reach thousands of customers.
          </p>
          <div className="flex flex-col gap-2">
            <button
              className="bg-[#CCFF00] text-black font-extrabold text-sm py-3 rounded-xl w-full active:scale-[0.97] transition-transform"
              style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 12px rgba(204,255,0,0.2)' }}
            >
              List Your Business — Free
            </button>
            <button className="text-white/50 font-bold text-xs py-2.5 rounded-xl border border-white/15 w-full">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ═══ DESKTOP CTA — Original ═══ */}
      <section className="hidden md:block bg-[#0033CC] py-16 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#CCFF00] rounded-full opacity-[0.06] blur-[100px]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white tracking-tight leading-[1.1]">
            Ready to grow your<br /><span className="text-[#CCFF00]">local business?</span>
          </h2>
          <p className="text-base text-white/50 mt-3 max-w-md mx-auto font-medium">
            List your PG, restaurant, or service for free and reach thousands of customers in your city.
          </p>
          <div className="mt-8 flex flex-row items-center justify-center gap-3">
            <button className="bg-[#CCFF00] text-black font-extrabold text-sm px-8 py-3.5 rounded-xl hover:brightness-110 hover:shadow-[0_0_30px_rgba(204,255,0,0.25)] transition-all">
              List Your Business — Free
            </button>
            <button className="text-white/60 hover:text-white font-bold text-sm px-8 py-3.5 rounded-xl border border-white/20 hover:border-white/40 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
