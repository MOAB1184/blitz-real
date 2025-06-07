'use client'

import { useState, useEffect, useRef } from 'react'
import {
  CameraIcon,
  PencilIcon,
  EyeIcon,
  GlobeAltIcon,
  LinkIcon,
  ChartBarIcon,
  SparklesIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

function DefaultAvatar({ name }: { name?: string | null }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  return (
    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-500 border-4 border-white shadow-sm">
      {initials}
    </div>
  )
}

interface ProfileForm {
  // Company Overview
  logo: string
  businessName: string
  tagline: string
  industry: string
  website: string
  socialMedia: {
    instagram: string
    twitter: string
    linkedin: string
  }
  location: string

  // Sponsorship Preferences
  preferredContentTypes: string[]
  budgetRange: {
    min: number
    max: number
  }
  targetAudience: {
    ageRange: string
    interests: string[]
    region: string
  }
  preferredPlatforms: string[]
  campaignGoals: string[]

  // Internal Notes
  notes: string
}

interface Listing {
  id: number
  title: string
  budget: number
  status: 'active' | 'draft' | 'closed'
  applications: number
  createdDate: string
  public: boolean
}

interface PastCampaign {
  id: number
  title: string
  roi: number
  engagementRate: number
  creators: string[]
  duration: string
  rating: number
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('listings')
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [editProfile, setEditProfile] = useState(false)
  const [profileForm, setProfileForm] = useState<any>({})

  const [listings, setListings] = useState<any[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [listingsError, setListingsError] = useState<string | null>(null)
  const [listingFilter, setListingFilter] = useState<'ALL'|'ACTIVE'|'DRAFT'|'CLOSED'>('ALL')

  const [pastCampaigns] = useState<PastCampaign[]>([
    {
      id: 1,
      title: 'Winter Food Tour',
      roi: 2.5,
      engagementRate: 4.2,
      creators: ['@foodie1', '@chef2'],
      duration: '2 months',
      rating: 4.5,
    },
    {
      id: 2,
      title: 'Local Restaurant Week',
      roi: 3.1,
      engagementRate: 5.0,
      creators: ['@foodie1', '@chef2', '@foodblogger3'],
      duration: '1 week',
      rating: 4.8,
    },
  ])

  const [editPrefs, setEditPrefs] = useState(false)
  const [prefsForm, setPrefsForm] = useState({
    budgetMin: profile?.budgetRange?.min || 0,
    budgetMax: profile?.budgetRange?.max || 0,
    preferredPlatforms: profile?.preferredPlatforms || [],
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        const res = await fetch('/api/auth/profile')
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json()
        setProfile(data)
        setProfileForm(data)
      } catch (e: any) {
        setProfileError(e.message)
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setListingsLoading(true)
        const res = await fetch('/api/listings?mine=1')
        if (!res.ok) throw new Error('Failed to fetch listings')
        const data = await res.json()
        setListings(data)
      } catch (e: any) {
        setListingsError(e.message)
      } finally {
        setListingsLoading(false)
      }
    }
    fetchListings()
  }, [])

  useEffect(() => {
    setPrefsForm({
      budgetMin: profile?.budgetRange?.min || 0,
      budgetMax: profile?.budgetRange?.max || 0,
      preferredPlatforms: profile?.preferredPlatforms || [],
    })
  }, [profile])

  const handleProfileChange = (field: string, value: any) => {
    setProfileForm((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }

  const handleProfileSave = async () => {
    try {
      setProfileLoading(true)
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      const data = await res.json()
      setProfile(data)
      setEditProfile(false)
    } catch (e: any) {
      setProfileError(e.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePrefsChange = (field: string, value: any) => {
    setPrefsForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePrefsPlatformToggle = (platform: string) => {
    setPrefsForm(prev => ({
      ...prev,
      preferredPlatforms: prev.preferredPlatforms.includes(platform)
        ? prev.preferredPlatforms.filter((p: string) => p !== platform)
        : [...prev.preferredPlatforms, platform],
    }))
  }

  const handlePrefsSave = async () => {
    const updated = {
      ...profileForm,
      budgetRange: { min: prefsForm.budgetMin, max: prefsForm.budgetMax },
      preferredPlatforms: prefsForm.preferredPlatforms,
    }
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    if (res.ok) {
      const data = await res.json()
      setProfile(data)
      setProfileForm(data)
      setEditPrefs(false)
    }
  }

  const filteredListings = listings.filter(l => {
    if (listingFilter === 'ALL') return true
    if (listingFilter === 'ACTIVE') return l.status === 'OPEN' || l.status === 'ACTIVE'
    if (listingFilter === 'DRAFT') return l.status === 'DRAFT'
    if (listingFilter === 'CLOSED') return l.status === 'CLOSED'
    return true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileForm((prev: Record<string, any>) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff4e3' }}>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>
        </div>
      </header>
      <main className="bg-[#fff4e3]">
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Sticky Sidebar */}
              <div className="lg:w-1/3 lg:sticky lg:top-6 lg:self-start">
                <div className="space-y-6">
                  {/* Company Overview Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      {/* Avatar */}
                      <div className="relative mb-4">
                        {profile?.image ? (
                          <img
                            src={profile.image}
                            alt={profile?.name || 'Profile'}
                            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-sm"
                            style={{ backgroundColor: '#ffd97a' }}
                          />
                        ) : (
                          <div className="h-32 w-32 flex items-center justify-center rounded-full border-4 border-white shadow-sm bg-gray-200">
                            <DefaultAvatar name={profile?.name || profile?.businessName || profile?.email || ''} />
                        </div>
                        )}
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 rounded-full bg-white p-2 border border-gray-200 shadow-sm hover:bg-gray-50"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                        >
                          <CameraIcon className="h-5 w-5" style={{ color: '#ffb600' }} />
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            setUploadingImage(true)
                            const reader = new FileReader()
                            reader.onloadend = async () => {
                              const base64 = reader.result
                              // Save to backend
                              const res = await fetch('/api/auth/profile', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...profileForm, image: base64 }),
                              })
                              if (res.ok) {
                                const data = await res.json()
                                setProfile(data)
                                setProfileForm(data)
                              }
                              setUploadingImage(false)
                            }
                            reader.readAsDataURL(file)
                          }}
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{profile?.name || profile?.businessName || profile?.email || ''}</h2>
                      <p className="text-gray-500 mt-1">{profile?.tagline || ''}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-900" style={{ backgroundColor: '#ffd699' }}>
                          {profile?.industry || ''}
                        </span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm font-medium text-gray-900">4.6</span>
                          <span className="ml-1 text-sm text-gray-500">/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-center space-x-3">
                        <a
                          href={profile?.website ? `https://${profile.website}` : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 text-gray-900"
                          style={{ backgroundColor: '#ffd97a' }}
                        >
                          <GlobeAltIcon className="h-4 w-4 mr-2" />
                          Website
                        </a>
                        <a
                          href={
                            profile?.socialMedia && profile.socialMedia.instagram
                              ? `https://instagram.com/${profile.socialMedia.instagram.replace('@', '')}`
                              : '#'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 text-gray-900"
                          style={{ backgroundColor: '#ffd97a' }}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Instagram
                        </a>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-medium text-gray-900">Sponsorship Preferences</h3>
                          {!editPrefs && (
                            <button onClick={() => setEditPrefs(true)} className="text-gray-500 hover:text-[#ffb600]">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        {/* Budget Range */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                          {editPrefs ? (
                            <div className="flex gap-2 items-center">
                              <input type="number" value={prefsForm.budgetMin} min={0} onChange={e => handlePrefsChange('budgetMin', Number(e.target.value))} className="form-input w-20" />
                              <span>-</span>
                              <input type="number" value={prefsForm.budgetMax} min={prefsForm.budgetMin} onChange={e => handlePrefsChange('budgetMax', Number(e.target.value))} className="form-input w-20" />
                            </div>
                          ) : (
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-900" style={{ backgroundColor: '#ffd97a' }}>
                              {profile?.budgetRange && typeof profile.budgetRange.min === 'number' && typeof profile.budgetRange.max === 'number'
                                ? `$${profile.budgetRange.min} - $${profile.budgetRange.max}`
                                : ''}
                            </span>
                          )}
                        </div>
                        {/* Preferred Platforms */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Platforms</label>
                          {editPrefs ? (
                            <div className="flex flex-wrap gap-2">
                              {["Instagram", "TikTok", "YouTube", "Live Events", "Twitch", "Other"].map(platform => (
                                <button
                                  key={platform}
                                  type="button"
                                  onClick={() => handlePrefsPlatformToggle(platform)}
                                  className={`px-3 py-1 rounded-full text-sm font-medium border ${prefsForm.preferredPlatforms.includes(platform) ? 'bg-[#ffd97a] border-[#ffb600] text-gray-900' : 'bg-white border-gray-300 text-gray-500'}`}
                                >
                                  {platform}
                                </button>
                              ))}
                            </div>
                          ) : (
                          <div className="flex flex-wrap gap-2">
                              {(profile?.preferredPlatforms || []).map((platform: string) => (
                              <span
                                key={platform}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-900"
                                style={{ backgroundColor: '#ffd97a' }}
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                          )}
                        </div>
                        {editPrefs && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={handlePrefsSave} className="btn-primary">Save</button>
                            <button onClick={() => setEditPrefs(false)} className="btn-secondary">Cancel</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Insights Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <SparklesIcon className="h-5 w-5 mr-2" style={{ color: '#ffb600' }} />
                      <h3 className="text-lg font-medium text-gray-900">AI Insights</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg p-4" style={{ backgroundColor: '#ffd97a' }}>
                        <h4 className="text-sm font-medium mb-2 text-gray-900">Budget Optimization</h4>
                        <p className="text-sm text-gray-900">
                          Based on your past campaigns, we recommend increasing your budget range by 20% for better ROI.
                        </p>
                      </div>
                      <div className="rounded-lg p-4" style={{ backgroundColor: '#ffd699' }}>
                        <h4 className="text-sm font-medium mb-2 text-gray-900">Audience Alignment</h4>
                        <p className="text-sm text-gray-900">
                          Your target audience shows strong overlap with food bloggers in your region.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Dynamic Content */}
              <div className="lg:w-2/3">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {['listings', 'campaigns', 'notes'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                          activeTab === tab
                            ? 'border-[#ffb600] text-[#ffb600]'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium capitalize`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content */}
                <div className="mt-6">
                  {activeTab === 'listings' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
                          <div className="flex space-x-2">
                            {['ALL', 'ACTIVE', 'DRAFT', 'CLOSED'].map((status) => (
                              <button
                                key={status}
                                onClick={() => setListingFilter(status as 'ALL'|'ACTIVE'|'DRAFT'|'CLOSED')}
                                className="px-3 py-1 rounded-full text-sm font-medium hover:bg-opacity-90 text-gray-900"
                                style={{ backgroundColor: '#ffd97a' }}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      {listingsLoading ? (
                        <div>Loading listings...</div>
                      ) : listingsError ? (
                        <div className="text-red-600">{listingsError}</div>
                      ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Budget
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applications
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {filteredListings.map((listing, index) => (
                              <tr key={listing.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#fff4e3]'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {listing.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${listing.budget}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-900 ${
                                      listing.status === 'active'
                                        ? 'bg-[#ffd97a]'
                                        : listing.status === 'draft'
                                        ? 'bg-[#ffd699]'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {listing.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {listing.applications}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {listing.createdDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex space-x-2">
                                      <button className="hover:text-[#ffb600]" onClick={() => router.push(`/dashboard/my-listings/${listing.id}/edit`)}>
                                      <PencilIcon className="h-5 w-5" />
                                    </button>
                                      <button className="hover:text-[#ffb600]" onClick={async () => {
                                        const updated = await fetch(`/api/listings/${listing.id}/visibility`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ public: !listing.public }),
                                        })
                                        if (updated.ok) {
                                          setListings((prev: any[]) => prev.map(l => l.id === listing.id ? { ...l, public: !l.public } : l))
                                        }
                                      }}>
                                        {listing.public ? <EyeIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5 text-gray-300" />}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'campaigns' && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {pastCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-[#ffb600] transition-colors duration-200"
                        >
                          <div className="p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{campaign.title}</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">ROI</span>
                                <span className="text-sm font-medium" style={{ color: '#ffb600' }}>{campaign.roi}x</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Engagement</span>
                                <span className="text-sm font-medium" style={{ color: '#ffb600' }}>{campaign.engagementRate}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Duration</span>
                                <span className="text-sm font-medium text-gray-900">{campaign.duration}</span>
                              </div>
                              <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">Creators</span>
                                  <div className="flex -space-x-2">
                                    {campaign.creators.map((creator, index) => (
                                      <div
                                        key={index}
                                        className="inline-flex items-center justify-center h-6 w-6 rounded-full border-2 border-white text-gray-900"
                                        style={{ backgroundColor: '#ffd97a' }}
                                      >
                                        {creator[1]}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="bg-white rounded-xl shadow-sm">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Internal Notes</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-900" style={{ backgroundColor: '#ffd97a' }}>
                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                            Private
                          </span>
                        </div>
                        <textarea
                          name="notes"
                          rows={6}
                          value={profile?.notes || ''}
                          onChange={(e) => handleProfileChange('notes', e.target.value)}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ffb600] focus:ring-[#ffb600] sm:text-sm"
                          placeholder="Add private notes about your sponsorship preferences and goals..."
                        />
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={handleProfileSave}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb600]"
                            style={{ backgroundColor: '#ffb600' }}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 