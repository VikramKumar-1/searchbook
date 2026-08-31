import { Metadata } from 'next';
import { MyBookingsView } from '@frontend/components/user/MyBookingsView';

export const metadata: Metadata = {
  title: 'My Bookings & Hotel Stays | SearchBook',
  description: 'View your confirmed hotel stays, booking codes, check-in timings, and Pay-at-Hotel details.',
  robots: { index: false, follow: false },
};

export default function MyBookingsPage() {
  return <MyBookingsView />;
}
