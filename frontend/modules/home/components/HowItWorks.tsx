import React from 'react';
import { Search, CheckCircle, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    num: '01',
    title: 'Search',
    desc: 'Tell us what you need — a PG, tiffin service, plumber, or a job near you.',
    accent: '#0033CC',
  },
  {
    icon: CheckCircle,
    num: '02',
    title: 'Compare',
    desc: 'Browse verified listings with real photos, honest pricing, and genuine reviews.',
    accent: '#10b981',
  },
  {
    icon: Star,
    num: '03',
    title: 'Connect',
    desc: 'Contact the provider directly — no middlemen, no hidden charges.',
    accent: '#FFB800',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#0f172a] py-16 px-5 md:px-8 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0033CC] opacity-[0.15] blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-1">How it works</p>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Three Steps. That&apos;s It.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: s.accent }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-[#CCFF00] text-[11px] font-black tracking-widest mb-2">STEP {s.num}</div>
                <h3 className="text-xl font-black text-white mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
