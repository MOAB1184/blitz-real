'use client'

import { MapPinIcon } from '@heroicons/react/24/outline'

export default function SponsorshipMapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sponsorship Map</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
              <div className="bg-white border border-indigo-100 rounded-lg p-5 shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4">
                  <div className="w-full h-[600px] bg-indigo-50 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="h-12 w-12 text-indigo-400" />
                    <p className="text-indigo-600 font-medium ml-2">Interactive Map Coming Soon</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-700 mb-2">Active Sponsorships</h4>
                    <p className="text-2xl font-bold text-indigo-600">12</p>
                    <p className="text-sm text-gray-600">Across your area</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-700 mb-2">Local Events</h4>
                    <p className="text-2xl font-bold text-indigo-600">8</p>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-700 mb-2">Creators</h4>
                    <p className="text-2xl font-bold text-indigo-600">15</p>
                    <p className="text-sm text-gray-600">In your network</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 