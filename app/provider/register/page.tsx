import { Metadata } from 'next';
import { PartnerRegisterView } from '@frontend/components/provider/PartnerRegisterView';

export const metadata: Metadata = {
  title: 'Partner Onboarding & Business Registration | SearchBook',
  description: 'List your hotel, PG, rental property or local services on SearchBook. Zero setup fees, instant booking inquiries, and verified partner badge.',
  robots: { index: true, follow: true },
};

export default function PartnerRegisterPage() {
  return <PartnerRegisterView />;
}
