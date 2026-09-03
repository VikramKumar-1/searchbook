import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listingService } from '@backend/modules/listing/listing.service';
import { ListingDetailView } from '@frontend/modules/listing/components/ListingDetailView';
import type { ListingDetailData } from '@frontend/modules/listing/hooks/useListings';

interface PageProps {
  params: Promise<{
    city: string;
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const listing = await listingService.getListingBySlug(slug);
    if (!listing) return { title: 'Hotel Not Found | SearchBook' };

    const title = `${listing.title} - Book Hourly & Daily Stays in ${listing.city.name} | SearchBook`;
    const description = `${listing.title} in ${listing.address}, ${listing.city.name}. Couple friendly hotel with 100% discretion, Pay at Hotel desk, sanitized rooms, high-speed WiFi, AC. Book 2h, 3h, 6h or 24h stays on SearchBook.`;
    const photo = listing.photos[0] || '/og-image.jpg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: photo, width: 1200, height: 630, alt: listing.title }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [photo],
      },
      alternates: {
        canonical: `/${listing.city.slug}/${listing.category.slug}/${listing.slug}`,
      },
    };
  } catch {
    return { title: 'Hotel Stays | SearchBook' };
  }
}

export default async function ListingPage({ params }: PageProps) {
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

  // JSON-LD Structured Data Schema for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: listing.title,
    description: listing.description || `Couple friendly hotel stay in ${listing.city.name}`,
    image: listing.photos,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city.name,
      addressCountry: 'IN',
    },
    geo: listing.latitude && listing.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: listing.latitude,
      longitude: listing.longitude,
    } : undefined,
    priceRange: listing.price ? `₹${listing.price}` : '₹199 - ₹899',
    telephone: listing.contactPhone,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: listing._count?.reviews || '24',
    },
  };

  // Convert decimal/null types for client component
  const clientListing: ListingDetailData = {
    ...listing,
    price: listing.price ? Number(listing.price) : null,
    reviews: listing.reviews.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      user: r.user || { id: 'guest', name: r.guestName || 'Verified Guest', avatar: null },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingDetailView listing={clientListing} />
    </>
  );
}
