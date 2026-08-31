import { ProviderDashboard } from '@frontend/components/provider/ProviderDashboard';

export const metadata = {
  title: 'Provider Dashboard | SearchBook',
  description: 'Manage your listings, properties, and services on SearchBook.',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-4">
      <ProviderDashboard />
    </main>
  );
}
