'use client';

import { useState } from 'react';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TagIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Placeholder data structures (replace with actual data fetching later)
interface Campaign {
  id: number;
  name: string;
  type: string; // e.g., 'Event', 'Creator', 'Organization'
  status: 'Active' | 'Completed' | 'Draft';
  impressions: number;
  engagementRate: number; // Percentage
  conversions?: number; // Optional
  roi?: string; // e.g., '+20%', '-5%', 'N/A'
  tags: string[]; // e.g., 'Tech', 'Food', 'Community'
}

const sampleCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Springfield Gaming Expo Sponsorship',
    type: 'Event',
    status: 'Completed',
    impressions: 15000,
    engagementRate: 3.5,
    conversions: 150,
    roi: '+25%',
    tags: ['Tech', 'Gaming'],
  },
  {
    id: 2,
    name: 'Healthy Living Influencer Collab',
    type: 'Creator',
    status: 'Active',
    impressions: 25000,
    engagementRate: 5.1,
    conversions: 300,
    roi: '+40%',
    tags: ['Health', 'Wellness', 'Influencer'],
  },
  {
    id: 3,
    name: 'Community Garden Project Support',
    type: 'Organization',
    status: 'Completed',
    impressions: 5000,
    engagementRate: 2.0,
    roi: '-10%',
    tags: ['Community', 'Sustainability'],
  },
  {
    id: 4,
    name: 'Fashion Pop-Up Event Sponsorship',
    type: 'Event',
    status: 'Active',
    impressions: 18000,
    engagementRate: 4.2,
    conversions: 200,
    roi: '+30%',
    tags: ['Fashion', 'Retail'],
  },
  {
    id: 5,
    name: 'Local Art Workshop Series Funding',
    type: 'Event',
    status: 'Completed',
    impressions: 7000,
    engagementRate: 2.8,
    roi: '+5%',
    tags: ['Arts', 'Community'],
  }
];

export default function CampaignAnalyticsPage() {
  const [filterTimeRange, setFilterTimeRange] = useState('Last 30 days');
  const [filterCampaignType, setFilterCampaignType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Basic filtering logic (expand as needed)
  const filteredCampaigns = sampleCampaigns.filter(campaign => {
    const matchesType = filterCampaignType === 'All' || campaign.type === filterCampaignType;
    const matchesStatus = filterStatus === 'All' || campaign.status === filterStatus;
    const matchesTags = filterTags.length === 0 || filterTags.some(tag => campaign.tags.includes(tag));
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Time range filtering would require date data on campaigns
    return matchesType && matchesStatus && matchesTags && matchesSearch;
  });

  // Calculate summary metrics (basic placeholders)
  const totalCampaigns = filteredCampaigns.length;
  const totalImpressions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const averageEngagementRate = totalCampaigns > 0 ? filteredCampaigns.reduce((sum, campaign) => sum + campaign.engagementRate, 0) / totalCampaigns : 0;
  // ROI and CTR calculation would be more complex and depend on data structure

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: 'var(--background-light)' }}>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-light)' }}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Campaign Analytics</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-10 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Sidebar - Filters */}
            <aside className="md:col-span-1">
              <div className="card p-6 shadow-md rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center"><FunnelIcon className="h-6 w-6 mr-2" /> Filters</h3>
                <div className="space-y-6">
                  {/* Time Range Filter */}
                  <div>
                    <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">Time Range</label>
                    <select
                      id="timeRange"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      value={filterTimeRange}
                      onChange={(e) => setFilterTimeRange(e.target.value)}
                      style={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border)' }}
                    >
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Custom Range</option>
                    </select>
                  </div>

                  {/* Campaign Type Filter */}
                  <div>
                    <label htmlFor="campaignType" className="block text-sm font-medium text-gray-700">Campaign Type</label>
                    <select
                      id="campaignType"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      value={filterCampaignType}
                      onChange={(e) => setFilterCampaignType(e.target.value)}
                      style={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border)' }}
                    >
                      <option>All</option>
                      <option>Event</option>
                      <option>Creator</option>
                      <option>Organization</option>
                      {/* Add other types as needed */}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="status"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border)' }}
                    >
                      <option>All</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Draft</option>
                    </select>
                  </div>

                  {/* Tags Filter (Simplified) */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (e.g. Industry)</label>
                    <input
                      type="text"
                      id="tags"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Enter tags (comma-separated)"
                      value={filterTags.join(', ')}
                      // This is a simplified input. A multi-select/tag input would be better.
                      onChange={(e) => setFilterTags(e.target.value.split(',').map(tag => tag.trim()))}
                      style={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border)' }}
                    />
                  </div>

                  {/* Search */}
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Campaign</label>
                    <input
                      type="text"
                      id="search"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border)' }}
                    />
                  </div>

                </div>
              </div>
            </aside>

            {/* Right Main Dashboard */}
            <section className="md:col-span-2 space-y-8">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Campaigns Card */}
                <div className="card p-6 shadow-md rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="flex items-center mb-4">
                    <CalendarDaysIcon className="h-8 w-8 text-primary mr-3" />
                    <h4 className="text-lg font-semibold text-gray-900">Total Campaigns</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{totalCampaigns}</p>
                  {/* Trend indicator placeholder */}
                  <div className="flex items-center text-sm mt-2 text-green-500">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    <span>+15% vs last month (Placeholder)</span>
                  </div>
                </div>

                {/* Total Impressions Card */}
                <div className="card p-6 shadow-md rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="flex items-center mb-4">
                    <ChartBarIcon className="h-8 w-8 text-primary mr-3" />
                    <h4 className="text-lg font-semibold text-gray-900">Total Impressions</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
                  {/* Trend indicator placeholder */}
                  <div className="flex items-center text-sm mt-2 text-green-500">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    <span>+10% vs last month (Placeholder)</span>
                  </div>
                </div>

                {/* Average Engagement Rate Card */}
                <div className="card p-6 shadow-md rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="flex items-center mb-4">
                    <UserGroupIcon className="h-8 w-8 text-primary mr-3" />
                    <h4 className="text-lg font-semibold text-gray-900">Avg. Engagement Rate</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{averageEngagementRate.toFixed(1)}%</p>
                  {/* Trend indicator placeholder */}
                  <div className="flex items-center text-sm mt-2 text-red-500">
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    <span>-5% vs last month (Placeholder)</span>
                  </div>
                </div>

                {/* Estimated ROI Card */}
                <div className="card p-6 shadow-md rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="flex items-center mb-4">
                    <CurrencyDollarIcon className="h-8 w-8 text-primary mr-3" />
                    <h4 className="text-lg font-semibold text-gray-900">Estimated ROI</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">+30%</p>
                  {/* Trend indicator placeholder */}
                  <div className="flex items-center text-sm mt-2 text-green-500">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    <span>+8% vs last month (Placeholder)</span>
                  </div>
                </div>

                {/* Click-through Rate Card (Placeholder) */}
                {/* Add as needed based on data */}

              </div>

              {/* Performance Table */}
              <div className="card p-6 shadow-md rounded-lg overflow-x-auto" style={{ backgroundColor: 'var(--background)' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Campaign Performance</h3>
                  {/* Export Button */}
                  <button className="px-4 py-2 rounded-md bg-warm-dark text-white text-sm font-medium hover:opacity-90">Export Report</button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50" style={{ backgroundColor: 'var(--background-light)' }}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement Rate</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                      <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCampaigns.map(campaign => (
                      <tr key={campaign.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.impressions.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.engagementRate.toFixed(1)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.roi || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-warm-dark">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visual Charts (Placeholders) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Engagement Over Time Chart */}
                <div className="card p-6 shadow-md rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Engagement Over Time</h3>
                  <div className="h-48 flex items-center justify-center text-gray-500">[ Line/Bar Chart Placeholder ]</div>
                </div>

                {/* ROI Breakdown Chart */}
                <div className="card p-6 shadow-md rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">ROI Breakdown</h3>
                  <div className="h-48 flex items-center justify-center text-gray-500">[ Pie/Bar Chart Placeholder ]</div>
                </div>

                {/* Audience Reach Chart (Placeholder) */}
                <div className="card p-6 shadow-md rounded-lg lg:col-span-2" style={{ backgroundColor: 'var(--background)' }}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Audience Reach</h3>
                  <div className="h-48 flex items-center justify-center text-gray-500">[ Geographic Heatmap/Bar Chart Placeholder ]</div>
                </div>
              </div>

              {/* AI-Powered Insights Panel (Placeholder) */}
              <div className="card p-6 shadow-md rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">AI-Powered Insights</h3>
                <div className="space-y-4 text-gray-700">
                  <p>• Top Performing Campaign: <strong>{sampleCampaigns[1].name}</strong> (Placeholder)</p>
                  <p>• Suggestion for Underperforming Campaign ({sampleCampaigns[2].name}): Try adjusting targeting demographics or increasing ad spend in key regions. (Placeholder)</p>
                  <p>• Trend: Your <strong>{sampleCampaigns[0].tags[0]}</strong>-related listings perform <strong>2.3x</strong> better in urban markets. (Placeholder)</p>
                </div>
              </div>

            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
