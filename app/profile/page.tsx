import { Metadata } from 'next';
import { MyBookingsView } from '@frontend/components/user/MyBookingsView';

export const metadata: Metadata = {
  title: 'My Profile & Bookings | SearchBook',
  description: 'Manage your profile and reservations on SearchBook.',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <MyBookingsView />;
}
