'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CalendarIcon, UserGroupIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

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

export default function ListingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => { setFadeIn(true); }, [])

  if (session?.user?.role === 'SPONSOR') {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Sponsors are not allowed to view listing details. This page is for creators only.</p>
        </div>
      </div>
    );
  }

    const fetchListing = async () => {
      try {
      setLoading(true)
      setError(null)
        const res = await fetch(`/api/listings/${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch listing')
        const data = await res.json()
        setListing(data)
        
        // Check if user has already applied
        if (session?.user?.id) {
          const applicationRes = await fetch(`/api/applications/check?listingId=${params.id}`)
          if (applicationRes.ok) {
            const { hasApplied } = await applicationRes.json()
            setHasApplied(hasApplied)
          }
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    if (params.id) fetchListing()
  }, [params.id, session?.user?.id])

  const handleApply = async () => {
    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }

    setIsApplying(true)
    try {
      const res = await fetch(`/api/listings/${params.id}/apply`, {
        method: 'POST',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to apply')
      }
      setHasApplied(true)
      router.push('/dashboard/applications')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Listing not found'}</p>
          <button
            onClick={fetchListing}
            className="mt-4 text-primary hover:text-primary-dark"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
    <div className="min-h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-8">
                <div className="flex items-center gap-4">
                  <img
                    src={listing.creator.image || '/default-avatar.png'}
                    alt={listing.creator.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                    <p className="text-sm text-gray-500">Posted by {listing.creator.name}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  {listing.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary-dark"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <div className="mt-6 prose max-w-none">
                  <p className="text-gray-600">{listing.description}</p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
                    <ul className="mt-4 space-y-3">
                      {listing.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="ml-3 text-gray-600">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Perks</h3>
                    <ul className="mt-4 space-y-3">
                      {listing.perks.map((perk, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="ml-3 text-gray-600">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Budget</h2>
                  <span className="text-2xl font-bold text-gray-900">${listing.budget}</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Posted {new Date(listing.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {Array.isArray(listing.applications) ? listing.applications.length : 0} applications
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    {listing.type}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={isApplying || listing.status !== 'OPEN' || hasApplied}
                    className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApplying ? 'Applying...' : hasApplied ? 'Already Applied' : 'Apply Now'}
                  </button>
                </div>

                {listing.status !== 'OPEN' && (
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    This listing is no longer accepting applications
                  </p>
                )}
                {hasApplied && (
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    You have already applied to this listing. Check your applications page for updates.
                  </p>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 