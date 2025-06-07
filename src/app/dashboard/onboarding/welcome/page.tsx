'use client'

import { useRouter } from 'next/navigation'
import { SparklesIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SponsorWelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Blitz, Sponsor!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            You're one step closer to finding amazing creators and events to support.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.push('/dashboard/onboarding/profile')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <UserCircleIcon className="h-5 w-5 text-white group-hover:text-white" aria-hidden="true" />
            </span>
            Set Up My Sponsor Profile
          </button>

          <button
            onClick={() => router.push('/dashboard/browse')}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
            </span>
            Browse Opportunities
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          You can create a listing anytime to offer a sponsorship opportunity.
        </p>
      </div>
    </div>
  )
} 