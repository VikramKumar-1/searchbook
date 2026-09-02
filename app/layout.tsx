import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@frontend/providers/QueryProvider';
import { AuthModalProvider } from '@frontend/providers/AuthModalProvider';
import { Navbar } from '@frontend/modules/core/components/layout/Navbar';
import { Footer } from '@frontend/modules/core/components/layout/Footer';
import { PostCheckoutReviewModal } from '@frontend/components/review/PostCheckoutReviewModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SearchBook | Local City Marketplace',
  description: 'Find best PGs, Hostels, and Services in your city.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen`}>
        <QueryProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <AuthModalProvider />
          <PostCheckoutReviewModal />
        </QueryProvider>
      </body>
    </html>
  );
}
