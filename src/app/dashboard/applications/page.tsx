'use client'

import { useState, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react'
import { useSession } from 'next-auth/react'

type ApplicationStatus = 'pending' | 'approved' | 'rejected'

interface Application {
  id: number
  title: string
  applicant: string
  status: ApplicationStatus
  date: string
  budget: number
  type: string
  listing: {
    id: string
    title: string
    description: string
    type: string
    budget: number
    status: string
    creatorId?: string
    sponsorId?: string
  }
}

const statusColors: Record<ApplicationStatus, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  approved: 'text-green-600 bg-green-50',
  rejected: 'text-red-600 bg-red-50',
}

const statusIcons: Record<ApplicationStatus, ForwardRefExoticComponent<SVGProps<SVGSVGElement> & { title?: string; titleId?: string } & RefAttributes<SVGSVGElement>>> = {
  pending: ClockIcon,
  approved: CheckCircleIcon,
  rejected: XCircleIcon,
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all')
  const { data: session } = useSession()

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/applications')
        if (!res.ok) throw new Error('Failed to fetch applications')
        const data = await res.json()
        setApplications(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const filteredApplications = selectedStatus === 'all'
    ? applications
    : applications.filter(app => app.status?.toLowerCase() === selectedStatus)

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--background)' }}>
      <header className="shadow" style={{ backgroundColor: 'var(--background-light)' }}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Applications</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="card px-5 py-6 sm:px-6 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--background)' }}>
              {/* Filters */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedStatus === 'all' ? 'text-gray-900' : 'text-gray-900 border-gray-200 hover:bg-gray-50'} transition`}
                    style={{ backgroundColor: selectedStatus === 'all' ? 'var(--primary)' : 'var(--background)', borderColor: selectedStatus === 'all' ? 'var(--primary)' : undefined }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedStatus('pending')}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      selectedStatus === 'pending'
                        ? 'bg-yellow-600 text-white border-yellow-600'
                        : 'text-yellow-600 border-yellow-200'
                    } transition`}
                    style={{ backgroundColor: selectedStatus === 'pending' ? undefined : 'var(--background)' }}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setSelectedStatus('approved')}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      selectedStatus === 'approved'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'text-green-600 border-green-200'
                    } transition`}
                     style={{ backgroundColor: selectedStatus === 'approved' ? undefined : 'var(--background)' }}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setSelectedStatus('rejected')}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      selectedStatus === 'rejected'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'text-red-600 border-red-200'
                    } transition`}
                    style={{ backgroundColor: selectedStatus === 'rejected' ? undefined : 'var(--background)' }}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-4">
                {filteredApplications.map((application) => {
                  const statusKey = (application.status?.toLowerCase?.() || 'pending') as ApplicationStatus
                  const StatusIcon = statusIcons[statusKey] || ClockIcon
                  return (
                    <div
                      key={application.id}
                      className="card border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      style={{ backgroundColor: 'var(--background)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{application.listing.title}</h3>
                          <p className="text-sm text-gray-500">Type: {application.listing.type}</p>
                          <p className="text-sm text-gray-500 mt-1">{application.listing.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${statusColors[statusKey]}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="capitalize">{statusKey}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Budget: ${application.listing.budget}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div>Applied: {application.date && !isNaN(Date.parse(application.date)) ? new Date(application.date).toLocaleDateString() : '-'}</div>
                        <div>Listing Status: {application.listing.status}</div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => window.location.href = `/dashboard/listings/${application.listing.id}`}
                          className="px-3 py-1 rounded text-gray-900 text-sm font-medium hover:opacity-90" 
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          View Listing
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 