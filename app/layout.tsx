import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@frontend/providers/QueryProvider';
import { AuthModalProvider } from '@frontend/providers/AuthModalProvider';
import { Navbar } from '@frontend/modules/core/components/layout/Navbar';
import { Footer } from '@frontend/modules/core/components/layout/Footer';
import { MobileBottomNav } from '@frontend/modules/core/components/layout/MobileBottomNav';
import { PostCheckoutReviewModal } from '@frontend/components/review/PostCheckoutReviewModal';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'SearchBook | Local City Marketplace',
  description: 'Find verified PGs, Hostels, Hourly Hotels, Flats, and Home Services with 0 Brokerage.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} font-sans bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen w-full max-w-full overflow-x-hidden`}>
        <QueryProvider>
          <Navbar />
          {/* 📱 pb-16 = space for mobile bottom nav | 🖥️ md:pb-0 = no extra space on desktop */}
          <div className="flex-1 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
            {children}
          </div>
          <Footer />
          {/* 📱 Mobile Bottom Navigation — visible only on mobile */}
          <MobileBottomNav />
          <AuthModalProvider />
          <PostCheckoutReviewModal />
        </QueryProvider>
      </body>
    </html>
  );
}

