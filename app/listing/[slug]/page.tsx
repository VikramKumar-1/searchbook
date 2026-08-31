import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { listingService } from '@backend/modules/listing/listing.service';
import { ListingDetailView } from '@frontend/modules/listing/components/ListingDetailView';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const listing = await listingService.getListingBySlug(slug);
    if (!listing) return { title: 'Hotel Not Found | SearchBook' };

    const title = `${listing.title} - Book Hourly Stays | SearchBook`;
    const description = `${listing.title} in ${listing.address}. Couple friendly hotel with 100% discretion and Pay at Hotel desk.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${listing.city.slug}/${listing.category.slug}/${listing.slug}`,
      },
    };
  } catch {
    return { title: 'Hotel Stays | SearchBook' };
  }
}

export default async function DirectListingPage({ params }: PageProps) {
  const { slug } = await params;
  
  let listing;
  try {
    listing = await listingService.getListingBySlug(slug);
  } catch {
    notFound();
  }

  if (!listing) {
    notFound();
  }

  // Redirect to full canonical SEO URL
  redirect(`/${listing.city.slug}/${listing.category.slug}/${listing.slug}`);
}
