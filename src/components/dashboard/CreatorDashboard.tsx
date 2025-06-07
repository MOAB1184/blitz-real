'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  StarIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import SponsorshipDetailView from '@/components/SponsorshipDetailView'; // Assuming this component can be reused

// Define the expected Listing type (can be shared or adapted from SponsorDashboard)
interface DashboardListing {
  id: number;
  name: string;
  type: string;
  platform: string;
  audience: string;
  budget: number;
  requirements: string[];
  category: string;
  risk: 'Low' | 'Medium' | 'High';
  alignment: string;
  alignmentScore: 'high' | 'medium' | 'low';
  pros: string[];
  cons: string[];
  verified: boolean;
  roi: string;
  rating?: number;
  location?: string;
  date?: string;
  description?: string;
  organizer?: {
    name: string;
    logoUrl?: string;
    platform?: string;
  };
  keyActivities?: string[];
  benefits?: string[];
  audienceProfile?: string;
  frequency?: string;
  similarSponsorships?: {
    name: string;
    roi?: string;
  }[];
  keyMetrics: string;
}

export default function CreatorDashboard() {
  const { data: session } = useSession();
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<DashboardListing | null>(null);
  const [stats, setStats] = useState({
    activeApplications: 0,
    sponsorMatches: 0,
    messages: 0,
    profileViews: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState<DashboardListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes, oppsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/recent-activity'),
          fetch('/api/dashboard/recommended-opportunities'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setRecentActivity(activityData);
        }

        if (oppsRes.ok) {
          const oppsData = await oppsRes.json();
          setRecommendedOpportunities(oppsData);
        }
      } catch (error) {
        setStats({ activeApplications: 0, sponsorMatches: 0, messages: 0, profileViews: 0 });
        setRecentActivity([]);
        setRecommendedOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const creatorDashboardStats = [
    { name: 'Active Applications', value: stats.activeApplications, icon: DocumentTextIcon, color: 'bg-blue-100 text-blue-800' },
    { name: 'Sponsor Matches', value: stats.sponsorMatches, icon: BuildingOfficeIcon, color: 'bg-green-100 text-green-800' },
    { name: 'Messages', value: stats.messages, icon: ChatBubbleLeftRightIcon, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Profile Views', value: stats.profileViews, icon: UserCircleIcon, color: 'bg-purple-100 text-purple-800' },
  ];

  const openDetailView = (listing: DashboardListing) => {
    setSelectedListing(listing);
    setIsDetailViewOpen(true);
  };

  const closeDetailView = () => {
    setIsDetailViewOpen(false);
    setSelectedListing(null);
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-light)' }}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Creator Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-10 sm:px-8 lg:px-10">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {creatorDashboardStats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <Link href="/dashboard/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{activity.time}</span>
                        <Link href={activity.link} className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                          View <ArrowRightIcon className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions for Creators */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/dashboard/browse" className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <MagnifyingGlassIcon className="h-10 w-10 text-blue-500 mb-2" />
                    <span className="font-medium">Browse Opportunities</span>
                    <span className="text-sm text-gray-500">Find new sponsorships</span>
                  </Link>

                  <Link href="/dashboard/applications" className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <DocumentTextIcon className="h-10 w-10 text-green-500 mb-2" />
                    <span className="font-medium">My Applications</span>
                    <span className="text-sm text-gray-500">Track your applications</span>
                  </Link>

                  <Link href="/dashboard/sponsor-matches" className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BuildingOfficeIcon className="h-10 w-10 text-purple-500 mb-2" />
                    <span className="font-medium">Sponsor Matches</span>
                    <span className="text-sm text-gray-500">See AI-recommended sponsors</span>
                  </Link>

                  <Link href="/dashboard/profile" className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <UserCircleIcon className="h-10 w-10 text-yellow-500 mb-2" />
                    <span className="font-medium">Update Profile</span>
                    <span className="text-sm text-gray-500">Keep your info current</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Card for Creators */}
          <div className="card p-10 mb-10" style={{ backgroundColor: 'var(--background-light)' }}>
            <div className="border-4 rounded-lg p-8" style={{ borderColor: 'var(--secondary)', backgroundColor: 'var(--background)' }}>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome, {session?.user?.name || 'Creator'}!</h2>
              <p className="text-lg text-gray-700 mb-8">
                Find exciting sponsorship opportunities, connect with brands, and grow your influence. Let Blitz help you monetize your passion!
              </p>
            </div>
          </div>

          {/* Recommended Opportunities Section */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Recommended Opportunities</h2>
            {recommendedOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {recommendedOpportunities.map(listing => (
                  <div key={listing.id} className="card border p-8 flex flex-col gap-4" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--background)' }}>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-xl text-gray-900">{listing.name}</span>
                      {listing.verified && <ShieldCheckIcon className="h-5 w-5 text-green-500 ml-2" title="Verified Sponsor" />}
                      <span className="ml-auto text-base px-4 py-1 rounded-full text-gray-900" style={{ backgroundColor: 'var(--secondary)' }}>{listing.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm mb-2">
                      {listing.location && (
                        <div className="flex items-center gap-1 mr-4">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <span>{listing.location}</span>
                        </div>
                      )}
                      {listing.date && (
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                          <span>{new Date(listing.date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 line-clamp-2">{listing.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Budget:</span>
                      <span className="text-gray-700">${listing.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Category:</span>
                      <span className="text-gray-700">{listing.category}</span>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => openDetailView(listing)}
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        View Details & Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recommended opportunities at the moment. Make sure your profile is complete to get better matches!</p>
            )}
          </section>

          {/* Placeholder for Portfolio and Performance (Coming Soon) */}
          <section className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <StarIcon className="h-8 w-8 text-yellow-500 mr-3" />
                  <h2 className="text-xl font-semibold">My Portfolio</h2>
                  <span className="ml-2 text-xs text-gray-400">(Coming Soon)</span>
                </div>
                <p className="text-gray-600">Showcase your best work, past collaborations, and testimonials to attract sponsors. This feature is under development.</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <PresentationChartLineIcon className="h-8 w-8 text-green-500 mr-3" />
                  <h2 className="text-xl font-semibold">Performance Analytics</h2>
                  <span className="ml-2 text-xs text-gray-400">(Coming Soon)</span>
                </div>
                <p className="text-gray-600">Track the performance of your sponsored content, understand your audience engagement, and measure your ROI. This feature is under development.</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Detail View Modal */}
      {isDetailViewOpen && selectedListing && (
        <SponsorshipDetailView
          listing={selectedListing}
          onClose={closeDetailView}
          isCreatorView={true} // Indicate this is a creator viewing the listing
        />
      )}
    </div>
  );
}

