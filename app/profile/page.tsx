import { Metadata } from 'next';
import { UserProfileView } from '@frontend/components/user/UserProfileView';

export const metadata: Metadata = {
  title: 'My Profile | SearchBook',
  description: 'Manage your profile and contact details on SearchBook.',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <UserProfileView />;
}
