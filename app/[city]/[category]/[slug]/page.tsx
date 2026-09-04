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
  const { city, slug } = await params;
  if (city?.startsWith('.') || slug?.endsWith('.json')) {
    return { title: 'Not Found | SearchBook' };
  }
  try {
    const listing = await listingService.getListingBySlug(slug);
    if (!listing) return { title: 'Hotel Not Found | SearchBook' };

    const cityName = listing.city?.name || 'India';
    const citySlug = listing.city?.slug || 'city';
    const categorySlug = listing.category?.slug || 'services';
    const title = `${listing.title} - ${cityName} | SearchBook`;
    const description = `${listing.title} in ${listing.address}, ${cityName}. ${listing.description || 'Verified listing on SearchBook.'}`;
    const photo = listing.photos?.[0] || '/og-image.jpg';

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
        canonical: `/${citySlug}/${categorySlug}/${listing.slug}`,
      },
    };
  } catch {
    return { title: 'Hotel Stays | SearchBook' };
  }
}

export default async function ListingPage({ params }: PageProps) {
  const { city, slug } = await params;

  if (city?.startsWith('.') || slug?.endsWith('.json')) {
    notFound();
  }
  
  let listing;
  try {
    listing = await listingService.getListingBySlug(slug);
  } catch (err) {
    console.error(`[ListingPage Error] Could not load listing for slug "${slug}":`, err);
    notFound();
  }

  if (!listing) {
    console.warn(`[ListingPage Warning] No listing returned for slug "${slug}"`);
    notFound();
  }

  const cityName = listing.city?.name || 'India';

  // JSON-LD Structured Data Schema for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: listing.title,
    description: listing.description || `Verified listing in ${cityName}`,
    image: listing.photos || [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: cityName,
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

  // Convert decimal/null types for client component with bulletproof defaults
  const clientListing: ListingDetailData = {
    ...listing,
    price: listing.price ? Number(listing.price) : null,
    city: listing.city || { id: 'city', name: cityName, slug: 'city' },
    category: listing.category || { id: 'category', name: 'Services', slug: 'services', icon: null },
    user: listing.user || {
      id: listing.userId || 'provider',
      name: 'Verified Host',
      isPremium: false,
      phone: listing.contactPhone || null,
      avatar: null,
    },
    photos: listing.photos && listing.photos.length > 0 ? listing.photos : [],
    amenities: listing.amenities && listing.amenities.length > 0 ? listing.amenities : [],
    viewCount: listing.viewCount ?? 0,
    openingTime: listing.openingTime ?? null,
    closingTime: listing.closingTime ?? null,
    tenantType: listing.tenantType ?? null,
    bhkType: listing.bhkType ?? null,
    furnishing: listing.furnishing ?? null,
    totalRooms: listing.totalRooms ?? 5,
    reviews: (listing.reviews || []).map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : (typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString()),
      user: r.user || { id: 'guest', name: (r as { guestName?: string | null }).guestName || 'Verified Guest', avatar: null },
    })),
    _count: {
      reviews: listing._count?.reviews || (listing.reviews ? listing.reviews.length : 0),
      bookmarks: 0,
    },
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
