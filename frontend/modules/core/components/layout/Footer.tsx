import React from 'react';

const links = {
  categories: [
    { label: 'PG & Hostels', href: '/category/pg-hostel' },
    { label: 'Food & Tiffin', href: '/category/food' },
    { label: 'Services', href: '/category/services' },
    { label: 'Jobs', href: '/category/jobs' },
  ],
  cities: [
    { label: 'Ranchi', href: '/city/ranchi' },
    { label: 'Delhi', href: '/city/delhi' },
    { label: 'Gurugram', href: '/city/gurugram' },
    { label: 'Noida', href: '/city/noida' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0a0f1e] pt-10 md:pt-14 pb-4 md:pb-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="bg-[#CCFF00] text-black font-black text-base px-1.5 py-0.5 rounded">Search</span>
              <span className="text-white font-black text-base">Book</span>
            </div>
            <p className="text-white/30 text-xs font-medium leading-relaxed max-w-[200px]">
              India&apos;s hyperlocal marketplace for PGs, food, services, and jobs.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white/50 font-bold text-[11px] uppercase tracking-widest mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-white/30 hover:text-white text-xs font-medium transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-5 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs font-medium">© {new Date().getFullYear()} SearchBook</p>
          <div className="flex gap-5">
            {['Twitter', 'Instagram', 'LinkedIn'].map((s) => (
              <a key={s} href="#" className="text-white/20 hover:text-[#CCFF00] text-xs font-medium transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
