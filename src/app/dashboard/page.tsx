'use client';

import { useSession } from 'next-auth/react';
import SponsorDashboard from '@/components/dashboard/SponsorDashboard';
import CreatorDashboard from '@/components/dashboard/CreatorDashboard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [fadeIn, setFadeIn] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { setFadeIn(true); }, []);

  useEffect(() => {
    if (session?.user?.id) {
      setProfileLoading(true);
      fetch('/api/auth/profile')
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setProfileLoading(false);
        })
        .catch(() => setProfileLoading(false));
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!profileLoading && profile && session?.user?.role) {
      console.log('Profile data:', profile);
      if (session.user.role === 'SPONSOR') {
        const hasBusinessName = !!profile.name;
        const hasIndustry = !!profile.socialLinks?.industry;
        console.log('Sponsor check:', { hasBusinessName, hasIndustry });
        if (!hasBusinessName || !hasIndustry) {
          router.replace('/dashboard/onboarding/profile');
        }
      } else if (session.user.role === 'CREATOR') {
        // Check if creator has completed basic profile setup
        const hasBio = !!profile.bio;
        const hasSocialLinks = profile.socialLinks && (
          profile.socialLinks.instagram || 
          profile.socialLinks.tiktok || 
          profile.socialLinks.youtube || 
          profile.socialLinks.twitter || 
          profile.socialLinks.linkedin
        );
        console.log('Creator check:', { hasBio, hasSocialLinks });
        if (!hasBio || !hasSocialLinks) {
          router.replace('/register/setup');
        }
      }
    }
  }, [profileLoading, profile, session?.user?.role, router]);

  if (status === 'loading' || profileLoading) {
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

  return (
    <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* ...rest of the dashboard landing page content... */}
    </div>
  );
}

