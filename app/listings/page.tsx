import { Metadata } from 'next';
import { ListingsExplorer } from '@frontend/modules/listing/components/explorer/ListingsExplorer';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string; search?: string }>;
}): Promise<Metadata> {
  const { category, city, search } = await searchParams;

  let title = 'Explore Listings & Local Services | SearchBook';
  let description =
    'Find verified Hostels, PGs, Flats, Hourly Hotels, Mess & Home Services in Delhi NCR, Ranchi, Gurugram, Noida, and Chandigarh with zero brokerage.';

  if (category) {
    const formattedCategory = category
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    title = `${formattedCategory} Listings ${city ? `in ${city.toUpperCase()}` : ''} | SearchBook`;
    description = `Browse top-rated and verified ${formattedCategory} listings on SearchBook with direct owner contact and best prices.`;
  } else if (city) {
    title = `Verified Stays & Services in ${city.toUpperCase()} | SearchBook`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `/listings${category ? `?category=${category}` : ''}`,
    },
  };
}

export default function ListingsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SearchBook Local Marketplace Listings',
    description: 'Explore verified PGs, flats, hourly hotels, and daily services.',
    url: 'https://searchbook.in/listings',
  };

  return (
    <main className="min-h-screen bg-gray-50/70">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingsExplorer />
    </main>
  );
}
