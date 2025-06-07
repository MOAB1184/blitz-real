'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

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
}

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings?mine=1')
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete listing')
      }

    setListings(listings.filter(listing => listing.id !== id))
    } catch (error) {
      console.error('Error deleting listing:', error)
      setError('Failed to delete listing')
    }
  }

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
      <div style={{ backgroundColor: 'var(--background)' }}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="sm:flex-auto">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Listings</h1>
              <p className="mt-4 text-base text-gray-500">
                Manage your listings and track applications.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={() => router.push('/dashboard/my-listings/create')}
                className="flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-gray-900"
                style={{ backgroundColor: 'var(--primary)', outlineColor: 'var(--primary)' }}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Listing
              </button>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No listings</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new listing.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/my-listings/create')}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:opacity-90"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Listing
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Title
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Type
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Budget
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Applications
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Created
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200" style={{ backgroundColor: 'var(--background)' }}>
                        {listings.map((listing) => (
                          <tr key={listing.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {listing.title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {listing.type}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              ${listing.budget}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                                ${listing.status === 'OPEN' ? 'bg-green-50 text-green-700' :
                                  listing.status === 'DRAFT' ? 'bg-yellow-50 text-yellow-700' :
                                  'bg-gray-50 text-gray-700'}`}>
                                {listing.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {listing.applications.length}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(listing.createdAt).toLocaleDateString()}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex justify-end gap-4">
                                <button
                                  type="button"
                                  onClick={() => router.push(`/dashboard/my-listings/${listing.id}/applications`)}
                                  className="rounded px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                  View Applications
                                </button>
                                <button
                                  type="button"
                                  onClick={() => router.push(`/dashboard/my-listings/${listing.id}/edit`)}
                                  className="rounded px-2.5 py-1.5 text-sm font-semibold text-warm-dark ring-1 ring-inset ring-warm-dark hover:bg-warm-light"
                                  style={{ backgroundColor: 'var(--background)' }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(listing.id)}
                                  className="rounded px-2.5 py-1.5 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 