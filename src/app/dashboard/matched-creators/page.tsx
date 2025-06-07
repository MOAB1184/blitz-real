'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  UserIcon,
  StarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface Creator {
  id: number;
  name: string;
  niche: string;
  avatar?: string;
  matchScore: number;
  rate: number;
  verified: boolean;
  followers: number;
  successfulPartnerships: number;
  audienceMatch: number;
  valueMatch: number;
  description: string;
  platforms: string[];
  audienceSize: number;
  audienceDemographics: string;
  engagementRate: string;
  contentTypes: string[];
  previousBrands: string[];
  location: string;
  website?: string;
  email: string;
}

export default function MatchedCreatorsPage() {
  const { data: session } = useSession();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRate: 0,
    maxRate: 5000,
    minMatchScore: 0,
    verifiedOnly: false,
    niches: [] as string[],
    platforms: [] as string[],
  });
  const [loading, setLoading] = useState(true);

  // Mock data for creators
  useEffect(() => {
    // In a real app, this would be an API call
    const mockCreators: Creator[] = [
      {
        id: 1,
        name: 'Alex Johnson',
        niche: 'Tech & Gaming',
        avatar: '/avatars/alex.jpg',
        matchScore: 92,
        rate: 500,
        verified: true,
        followers: 75000,
        successfulPartnerships: 27,
        audienceMatch: 95,
        valueMatch: 89,
        description: 'Tech reviewer and gaming streamer with a focus on PC hardware and indie games.',
        platforms: ['YouTube', 'Twitch', 'Instagram'],
        audienceSize: 75000,
        audienceDemographics: '18-34, 70% male, tech enthusiasts',
        engagementRate: '8.5%',
        contentTypes: ['Reviews', 'Tutorials', 'Live streams'],
        previousBrands: ['Razer', 'AMD', 'Indie Game Studios'],
        location: 'Seattle, WA',
        website: 'https://alexjtech.com',
        email: 'alex@alexjtech.com'
      },
      {
        id: 2,
        name: 'Sarah Chen',
        niche: 'Fitness & Wellness',
        avatar: '/avatars/sarah.jpg',
        matchScore: 87,
        rate: 350,
        verified: true,
        followers: 45000,
        successfulPartnerships: 15,
        audienceMatch: 82,
        valueMatch: 94,
        description: 'Certified personal trainer sharing workout routines, nutrition tips, and wellness advice.',
        platforms: ['Instagram', 'YouTube', 'TikTok'],
        audienceSize: 45000,
        audienceDemographics: '25-45, 80% female, fitness enthusiasts',
        engagementRate: '6.2%',
        contentTypes: ['Workout videos', 'Meal prep', 'Product reviews'],
        previousBrands: ['Lululemon', 'Protein Bar Co.', 'Fitness App'],
        location: 'Portland, OR',
        website: 'https://sarahfitlife.com',
        email: 'sarah@sarahfitlife.com'
      },
      {
        id: 3,
        name: 'Marcus Williams',
        niche: 'Food & Cooking',
        avatar: '/avatars/marcus.jpg',
        matchScore: 78,
        rate: 400,
        verified: false,
        followers: 32000,
        successfulPartnerships: 8,
        audienceMatch: 75,
        valueMatch: 81,
        description: 'Home chef creating easy-to-follow recipes and food reviews with a focus on local ingredients.',
        platforms: ['Instagram', 'TikTok', 'Blog'],
        audienceSize: 32000,
        audienceDemographics: '25-55, mixed gender, food enthusiasts',
        engagementRate: '5.8%',
        contentTypes: ['Recipe videos', 'Restaurant reviews', 'Cooking tips'],
        previousBrands: ['Local Restaurants', 'Cookware Brand', 'Meal Kit Service'],
        location: 'Chicago, IL',
        email: 'marcus@tastewithmarc.com'
      },
      {
        id: 4,
        name: 'Jasmine Lee',
        niche: 'Travel & Lifestyle',
        avatar: '/avatars/jasmine.jpg',
        matchScore: 85,
        rate: 600,
        verified: true,
        followers: 120000,
        successfulPartnerships: 32,
        audienceMatch: 88,
        valueMatch: 82,
        description: 'Travel blogger and photographer documenting adventures around the world with a focus on sustainable tourism.',
        platforms: ['Instagram', 'YouTube', 'Blog'],
        audienceSize: 120000,
        audienceDemographics: '25-40, 65% female, travel enthusiasts',
        engagementRate: '4.2%',
        contentTypes: ['Travel guides', 'Photography', 'Hotel reviews'],
        previousBrands: ['Luggage Company', 'Hotel Chain', 'Travel App'],
        location: 'Los Angeles, CA',
        website: 'https://wanderwithjas.com',
        email: 'jasmine@wanderwithjas.com'
      },
      {
        id: 5,
        name: 'David Kim',
        niche: 'Art & Design',
        avatar: '/avatars/david.jpg',
        matchScore: 90,
        rate: 450,
        verified: true,
        followers: 65000,
        successfulPartnerships: 19,
        audienceMatch: 92,
        valueMatch: 88,
        description: 'Digital artist and designer creating tutorials, speed-paints, and design critiques.',
        platforms: ['Instagram', 'YouTube', 'Behance'],
        audienceSize: 65000,
        audienceDemographics: '18-35, mixed gender, artists and designers',
        engagementRate: '7.5%',
        contentTypes: ['Tutorials', 'Speed paints', 'Product reviews'],
        previousBrands: ['Adobe', 'Wacom', 'Art Supply Stores'],
        location: 'New York, NY',
        website: 'https://davidkimdesign.com',
        email: 'david@davidkimdesign.com'
      }
    ];

    setCreators(mockCreators);
    setFilteredCreators(mockCreators);
    setLoading(false);
  }, []);

  // Filter creators based on search term and filters
  useEffect(() => {
    let results = creators;

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        creator =>
          creator.name.toLowerCase().includes(term) ||
          creator.niche.toLowerCase().includes(term) ||
          creator.description.toLowerCase().includes(term) ||
          creator.platforms.some(p => p.toLowerCase().includes(term))
      );
    }

    // Apply filters
    results = results.filter(
      creator =>
        creator.rate >= filters.minRate &&
        creator.rate <= filters.maxRate &&
        creator.matchScore >= filters.minMatchScore &&
        (!filters.verifiedOnly || creator.verified) &&
        (filters.niches.length === 0 ||
          filters.niches.includes(creator.niche)) &&
        (filters.platforms.length === 0 ||
          creator.platforms.some(p => filters.platforms.includes(p)))
    );

    setFilteredCreators(results);
  }, [searchTerm, filters, creators]);

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
    } else if (name === 'niche') {
      const niche = value;
      setFilters({
        ...filters,
        niches: filters.niches.includes(niche)
          ? filters.niches.filter(i => i !== niche)
          : [...filters.niches, niche],
      });
    } else if (name === 'platform') {
      const platform = value;
      setFilters({
        ...filters,
        platforms: filters.platforms.includes(platform)
          ? filters.platforms.filter(p => p !== platform)
          : [...filters.platforms, platform],
      });
    } else {
      setFilters({
        ...filters,
        [name]: type === 'number' ? Number(value) : value,
      });
    }
  };

  const handleContactCreator = (creator: Creator) => {
    // In a real app, this would open a conversation with the creator
    console.log(`Contact creator: ${creator.name}`);
    window.location.href = `/dashboard/messages?recipient=${creator.id}`;
  };

  const niches = Array.from(new Set(creators.map(creator => creator.niche)));
  const platforms = Array.from(
    new Set(creators.flatMap(creator => creator.platforms))
  );

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <p className="text-center">Please sign in to view matched creators.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matched Creators</h1>
          <p className="mt-1 text-gray-500">
            Discover creators that align with your brand values and target audience
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search creators..."
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
          <h2 className="text-lg font-medium mb-4">Filter Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minRate"
                  value={filters.minRate}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxRate"
                  value={filters.maxRate}
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
                  Verified creators only
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niches
            </label>
            <div className="flex flex-wrap gap-2">
              {niches.map(niche => (
                <label
                  key={niche}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    filters.niches.includes(niche)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  } cursor-pointer hover:bg-gray-200`}
                >
                  <input
                    type="checkbox"
                    name="niche"
                    value={niche}
                    checked={filters.niches.includes(niche)}
                    onChange={handleFilterChange}
                    className="sr-only"
                  />
                  {niche}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <label
                  key={platform}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    filters.platforms.includes(platform)
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  } cursor-pointer hover:bg-gray-200`}
                >
                  <input
                    type="checkbox"
                    name="platform"
                    value={platform}
                    checked={filters.platforms.includes(platform)}
                    onChange={handleFilterChange}
                    className="sr-only"
                  />
                  {platform}
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
      ) : filteredCreators.length === 0 ? (
        <div className="text-center py-20">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No creators found
          </h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filters to find more matches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCreators.map(creator => (
            <div
              key={creator.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {creator.avatar ? (
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {creator.name}
                        </h2>
                        {creator.verified && (
                          <ShieldCheckIcon
                            className="ml-2 h-5 w-5 text-blue-500"
                            title="Verified Creator"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{creator.niche}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-lg font-bold text-blue-600">
                      {creator.matchScore}% Match
                    </div>
                    <div className="text-sm text-gray-500">
                      Rate: ${creator.rate}/post
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">{creator.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {creator.platforms.map(platform => (
                    <span
                      key={platform}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Followers
                      </div>
                      <div className="text-lg font-semibold">
                        {creator.followers.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Partnerships
                      </div>
                      <div className="text-lg font-semibold">
                        {creator.successfulPartnerships}
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
                        {creator.audienceMatch}%
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
                        {creator.valueMatch}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Creator Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Audience Demographics</h4>
                      <p className="text-sm text-gray-600">{creator.audienceDemographics}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Engagement Rate</h4>
                      <p className="text-sm text-gray-600">{creator.engagementRate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Content Types</h4>
                      <p className="text-sm text-gray-600">{creator.contentTypes.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Previous Brand Collaborations</h4>
                      <p className="text-sm text-gray-600">{creator.previousBrands.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleContactCreator(creator)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contact Creator
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

