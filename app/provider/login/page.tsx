import { Metadata } from 'next';
import { PartnerLoginView } from '@frontend/components/provider/PartnerLoginView';

export const metadata: Metadata = {
  title: 'Partner Login | SearchBook',
  description: 'Log in to your SearchBook business partner dashboard.',
  robots: { index: false, follow: false },
};

export default function PartnerLoginPage() {
  return <PartnerLoginView />;
}
