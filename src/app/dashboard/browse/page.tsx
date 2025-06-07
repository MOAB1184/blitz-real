'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface Listing {
  id: string
  title: string
  description: string
  type: 'SPONSORSHIP' | 'COLLABORATION' | 'PARTNERSHIP'
  budget: number
  requirements: string[]
  perks: string[]
  status: 'OPEN' | 'CLOSED' | 'DRAFT'
  createdAt: string
  applications: { id: string }[]
  categories: { id: string; name: string }[]
  creator: {
    id: string
    name: string
    email: string
    image: string
  }
}

const categories = [
  'Gaming',
  'Technology',
  'Health & Fitness',
  'Food & Cooking',
  'Travel',
  'Sports',
  'Arts',
  'Community',
  'Music'
]

const types = ['SPONSORSHIP', 'COLLABORATION', 'PARTNERSHIP']

export default function BrowsePage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    minBudget: '',
    maxBudget: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [filters])

  const fetchListings = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.type) queryParams.append('type', filters.type)
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.minBudget) queryParams.append('minBudget', filters.minBudget)
      if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget)

      const response = await fetch(`/api/listings?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error('Error fetching listings:', error)
      setError('Failed to load listings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    listing.description.toLowerCase().includes(filters.search.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchListings}
            className="mt-4 text-primary hover:text-primary-dark"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Browse Listings</h1>
            <p className="mt-4 text-base text-gray-500">
              Find and apply to listings that match your interests.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="Search listings..."
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FunnelIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Filters
            </button>
            </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
              <select
                  id="type"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                ))}
              </select>
            </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
              <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                ))}
              </select>
            </div>

              <div>
                <label htmlFor="minBudget" className="block text-sm font-medium text-gray-700">
                  Min Budget
              </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="minBudget"
                    value={filters.minBudget}
                    onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                    className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="0"
                  />
                </div>
                    </div>

              <div>
                <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700">
                  Max Budget
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="maxBudget"
                    value={filters.maxBudget}
                    onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                    className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="10000"
                  />
                </div>
                    </div>
                </div>
          )}
                    </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={listing.creator.image || '/default-avatar.png'}
                    alt={listing.creator.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{listing.creator.name}</h3>
                    <p className="text-sm text-gray-500">{listing.type}</p>
                    </div>
                </div>

                <h3 className="mt-4 text-lg font-medium text-gray-900">{listing.title}</h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">{listing.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {listing.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center rounded-full bg-primary-light px-2 py-1 text-xs font-medium text-primary-dark"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">${listing.budget}</span>
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/listings/${listing.id}`)}
                    className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:opacity-90"
                  >
                    View Details
                  </button>
                </div>
                 </div>
              </div>
            ))}
          </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
        </div>
        )}
      </div>
    </div>
  )
} 