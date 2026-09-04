import { cache } from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { listingService } from '@backend/modules/listing/listing.service';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getCachedListing = cache(async (slug: string) => {
  return listingService.getListingBySlug(slug);
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const listing = await getCachedListing(slug);
    if (!listing) return { title: 'Hotel Not Found | SearchBook' };

    const cityName = listing.city?.name || 'India';
    const citySlug = listing.city?.slug || 'city';
    const categorySlug = listing.category?.slug || 'services';
    const title = `${listing.title} - ${cityName} | SearchBook`;
    const description = `${listing.title} in ${listing.address}. Direct booking with 0 brokerage on SearchBook.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${citySlug}/${categorySlug}/${listing.slug}`,
      },
    };
  } catch {
    return { title: 'Listing | SearchBook' };
  }
}

export default async function DirectListingPage({ params }: PageProps) {
  const { slug } = await params;
  
  let listing;
  try {
    listing = await getCachedListing(slug);
  } catch (err) {
    console.error(`[DirectListingPage Error] Failed to fetch listing for slug "${slug}":`, err);
    notFound();
  }

  if (!listing) {
    notFound();
  }

  // Redirect to full canonical SEO URL
  const citySlug = listing.city?.slug || 'city';
  const categorySlug = listing.category?.slug || 'services';
  redirect(`/${citySlug}/${categorySlug}/${listing.slug}`);
}
