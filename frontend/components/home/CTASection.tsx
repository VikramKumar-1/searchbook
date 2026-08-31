import React from 'react';

export function CTASection() {
  return (
    <section className="bg-[#0033CC] py-16 px-5 md:px-8 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#CCFF00] rounded-full opacity-[0.06] blur-[100px]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
          Ready to grow your<br /><span className="text-[#CCFF00]">local business?</span>
        </h2>
        <p className="text-sm md:text-base text-white/50 mt-3 max-w-md mx-auto font-medium">
          List your PG, restaurant, or service for free and reach thousands of customers in your city.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button className="bg-[#CCFF00] text-black font-extrabold text-sm px-8 py-3.5 rounded-xl hover:brightness-110 hover:shadow-[0_0_30px_rgba(204,255,0,0.25)] transition-all">
            List Your Business — Free
          </button>
          <button className="text-white/60 hover:text-white font-bold text-sm px-8 py-3.5 rounded-xl border border-white/20 hover:border-white/40 transition-all">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
