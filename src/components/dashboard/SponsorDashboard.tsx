'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  StarIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  PlusCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import SponsorshipDetailView from '@/components/SponsorshipDetailView';

const filters = ['All', 'Events', 'Creators', 'Organizations'];

// Define the expected Listing type
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

export default function SponsorDashboard() {
  const { data: session } = useSession();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<DashboardListing | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recommendedListings, setRecommendedListings] = useState<DashboardListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const statsRes = await fetch('/api/dashboard/stats?sponsor=1');
        const listingsRes = await fetch('/api/dashboard/recommended-listings');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setDashboardStats([
            { name: 'Active Listings', value: statsData.activeListings ?? 0, icon: PlusCircleIcon, color: 'bg-blue-100 text-blue-800' },
            { name: 'Pending Applications', value: statsData.pendingApplications ?? 0, icon: UserGroupIcon, color: 'bg-yellow-100 text-yellow-800' },
            { name: 'Unread Messages', value: statsData.messages ?? 0, icon: ChatBubbleLeftRightIcon, color: 'bg-green-100 text-green-800' },
            { name: 'Budget Allocated', value: `$${statsData.budgetAllocated ?? 0}`, icon: CurrencyDollarIcon, color: 'bg-purple-100 text-purple-800' },
          ]);
        }
        if (listingsRes && listingsRes.ok) {
          setRecommendedListings(await listingsRes.json());
        }
      } catch (e) {
        setDashboardStats([
          { name: 'Active Listings', value: 0, icon: PlusCircleIcon, color: 'bg-blue-100 text-blue-800' },
          { name: 'Pending Applications', value: 0, icon: UserGroupIcon, color: 'bg-yellow-100 text-yellow-800' },
          { name: 'Unread Messages', value: 0, icon: ChatBubbleLeftRightIcon, color: 'bg-green-100 text-green-800' },
          { name: 'Budget Allocated', value: '$0', icon: CurrencyDollarIcon, color: 'bg-purple-100 text-purple-800' },
        ]);
        setRecommendedListings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  useEffect(() => { setFadeIn(true); }, []);

  const filteredListings = selectedFilter === 'All'
    ? recommendedListings
    : recommendedListings.filter(l => l.type === selectedFilter);

  const openDetailView = (listing: DashboardListing) => {
    setSelectedListing(listing);
    setIsDetailViewOpen(true);
  };

  const closeDetailView = () => {
    setIsDetailViewOpen(false);
    setSelectedListing(null);
  };

  // Function to get filter button class names
  const getFilterButtonClassNames = (filter: string) => {
    const baseClasses = "px-4 py-2 rounded-md text-sm font-medium";
    return `${baseClasses} ${
      selectedFilter === filter
        ? 'bg-warm-dark text-white'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
    }`;
  };

  return (
    <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-light)' }}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Sponsor Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-10 sm:px-8 lg:px-10">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {dashboardStats.map((stat) => (
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
          
            {/* Quick Actions Full Width */}
            <div className="mb-10">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/dashboard/my-listings/create" className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <PlusCircleIcon className="h-10 w-10 text-blue-500 mb-2" />
                    <span className="font-medium">Create New Listing</span>
                    <span className="text-sm text-gray-500">Post a new sponsorship opportunity</span>
                  </Link>
                  
                  <Link href="/dashboard/browse" className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <MagnifyingGlassIcon className="h-10 w-10 text-green-500 mb-2" />
                    <span className="font-medium">Browse Creators</span>
                    <span className="text-sm text-gray-500">Find creators for your brand</span>
                  </Link>
                  
                  <Link href="/dashboard/matched-creators" className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <UserGroupIcon className="h-10 w-10 text-purple-500 mb-2" />
                    <span className="font-medium">View Matched Creators</span>
                    <span className="text-sm text-gray-500">See AI-recommended matches</span>
                  </Link>
                  
                  <Link href="/dashboard/messages" className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <ChatBubbleLeftRightIcon className="h-10 w-10 text-yellow-500 mb-2" />
                    <span className="font-medium">Messages</span>
                    <span className="text-sm text-gray-500">Check your conversations</span>
                  </Link>
              </div>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="card p-10 mb-10" style={{ backgroundColor: 'var(--background-light)' }}>
            <div className="border-4 rounded-lg p-8" style={{ borderColor: 'var(--secondary)', backgroundColor: 'var(--background)' }}>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Welcome, {session?.user?.name || 'Sponsor'}!</h2>
              <p className="text-lg text-gray-700 mb-8">
                Supporting local events and creators in your community. Discover, connect, and grow with AI-powered recommendations tailored for small businesses, local events, and creators.
              </p>
            </div>
          </div>

          {/* Recommended Listings Section */}
            {/* Removed the entire <section className="mt-10"> with heading 'Recommended Opportunities' */}
        </div>
      </main>

      {/* Detail View Modal */}
      {isDetailViewOpen && selectedListing && (
        <SponsorshipDetailView
          listing={selectedListing}
          onClose={closeDetailView}
        />
      )}
      </div>
    </div>
  );
}

