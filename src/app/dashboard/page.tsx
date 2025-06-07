'use client';

import { useSession } from 'next-auth/react';
import SponsorDashboard from '@/components/dashboard/SponsorDashboard';
import CreatorDashboard from '@/components/dashboard/CreatorDashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  if (session.user?.role === 'SPONSOR') {
    return <SponsorDashboard />;
  } else {
    return <CreatorDashboard />;
  }
}

