import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { listingService } from '@backend/modules/listing/listing.service';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const listing = await listingService.getListingBySlug(slug);
    if (!listing) return { title: 'Listing | SearchBook' };

    const cityName = listing.city?.name || 'India';
    const title = `${listing.title} - ${cityName} | SearchBook`;
    const description = `${listing.title} in ${listing.address}, ${cityName}. Direct booking with 0 brokerage on SearchBook.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${listing.city?.slug || 'city'}/${listing.category?.slug || 'service'}/${listing.slug}`,
      },
    };
  } catch {
    return { title: 'Listing | SearchBook' };
  }
}

/**
 * Direct route handler for `/listings/[slug]`.
 * Redirects to the full canonical SEO route: `/[city]/[category]/[slug]`
 */
export default async function ListingsDirectPage({ params }: PageProps) {
  const { slug } = await params;
  
  let listing;
  try {
    listing = await listingService.getListingBySlug(slug);
  } catch (err) {
    console.error(`[ListingsDirectPage Error] Failed to fetch listing for slug "${slug}":`, err);
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
