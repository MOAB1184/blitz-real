'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  BuildingOfficeIcon,
  StarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import SponsorshipDetailView from '@/components/SponsorshipDetailView';

interface Sponsor {
  id: number;
  name: string;
  industry: string;
  logo?: string;
  matchScore: number;
  budget: number;
  verified: boolean;
  activeListings: number;
  successfulPartnerships: number;
  audienceMatch: number;
  valueMatch: number;
  description: string;
  listings: Listing[];
}

interface Listing {
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

export default function SponsorMatchesPage() {
  const { data: session } = useSession();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minBudget: 0,
    maxBudget: 100000,
    minMatchScore: 0,
    verifiedOnly: false,
    industries: [] as string[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSponsors() {
      setLoading(true);
      try {
        const res = await fetch('/api/sponsor-matches');
        if (!res.ok) throw new Error('Failed to fetch sponsors');
        const data = await res.json();
        setSponsors(data);
        setFilteredSponsors(data);
      } catch (e) {
        setSponsors([]);
        setFilteredSponsors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSponsors();
  }, []);

  // Filter sponsors based on search term and filters
  useEffect(() => {
    let results = sponsors;

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        sponsor =>
          sponsor.name.toLowerCase().includes(term) ||
          sponsor.industry.toLowerCase().includes(term) ||
          sponsor.description.toLowerCase().includes(term)
      );
    }

    // Apply filters
    results = results.filter(
      sponsor =>
        sponsor.budget >= filters.minBudget &&
        sponsor.budget <= filters.maxBudget &&
        sponsor.matchScore >= filters.minMatchScore &&
        (!filters.verifiedOnly || sponsor.verified) &&
        (filters.industries.length === 0 ||
          filters.industries.includes(sponsor.industry))
    );

    setFilteredSponsors(results);
  }, [searchTerm, filters, sponsors]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFilters({
        ...filters,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'industry') {
      const industry = value;
      setFilters({
        ...filters,
        industries: filters.industries.includes(industry)
          ? filters.industries.filter(i => i !== industry)
          : [...filters.industries, industry],
      });
    } else {
      setFilters({
        ...filters,
        [name]: type === 'number' ? Number(value) : value,
      });
    }
  };

  const handleViewListing = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleCloseListing = () => {
    setSelectedListing(null);
  };

  const industries = Array.from(
    new Set(sponsors.map(sponsor => sponsor.industry))
  );

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <p className="text-center">Please sign in to view sponsor matches.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sponsor Matches</h1>
          <p className="mt-1 text-gray-500">
            Discover sponsors that align with your content and values
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sponsors..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-medium mb-4">Filter Sponsors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minBudget"
                  value={filters.minBudget}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxBudget"
                  value={filters.maxBudget}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Match Score
              </label>
              <input
                type="range"
                name="minMatchScore"
                min="0"
                max="100"
                value={filters.minMatchScore}
                onChange={handleFilterChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>{filters.minMatchScore}%</span>
                <span>100%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Verified sponsors only
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industries
            </label>
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <label
                  key={industry}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    filters.industries.includes(industry)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  } cursor-pointer hover:bg-gray-200`}
                >
                  <input
                    type="checkbox"
                    name="industry"
                    value={industry}
                    checked={filters.industries.includes(industry)}
                    onChange={handleFilterChange}
                    className="sr-only"
                  />
                  {industry}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredSponsors.length === 0 ? (
        <div className="text-center py-20">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No sponsors found
          </h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filters to find more matches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSponsors.map(sponsor => (
            <div
              key={sponsor.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {sponsor.logo ? (
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {sponsor.name}
                        </h2>
                        {sponsor.verified && (
                          <ShieldCheckIcon
                            className="ml-2 h-5 w-5 text-blue-500"
                            title="Verified Sponsor"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{sponsor.industry}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-lg font-bold text-blue-600">
                      {sponsor.matchScore}% Match
                    </div>
                    <div className="text-sm text-gray-500">
                      Budget: ${sponsor.budget.toLocaleString()}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">{sponsor.description}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Active Listings
                      </div>
                      <div className="text-lg font-semibold">
                        {sponsor.activeListings}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Successful Partnerships
                      </div>
                      <div className="text-lg font-semibold">
                        {sponsor.successfulPartnerships}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Audience Match
                      </div>
                      <div className="text-lg font-semibold">
                        {sponsor.audienceMatch}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <StarIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Value Alignment
                      </div>
                      <div className="text-lg font-semibold">
                        {sponsor.valueMatch}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Active Opportunities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sponsor.listings.map(listing => (
                      <div
                        key={listing.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewListing(listing)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-md font-medium text-gray-900">
                            {listing.name}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              listing.alignmentScore === 'high'
                                ? 'bg-green-100 text-green-800'
                                : listing.alignmentScore === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {listing.alignmentScore === 'high'
                              ? 'High Match'
                              : listing.alignmentScore === 'medium'
                              ? 'Medium Match'
                              : 'Low Match'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {listing.type} • ${listing.budget.toLocaleString()}
                        </p>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {listing.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewListing(listing);
                          }}
                          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listing Detail Modal */}
      {selectedListing && (
        <SponsorshipDetailView
          listing={selectedListing}
          onClose={handleCloseListing}
          isCreatorView={true}
        />
      )}
    </div>
  );
}

