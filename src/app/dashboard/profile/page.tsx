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
import axios from 'axios'

function DefaultAvatar({ name }: { name?: string | null }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  return (
    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-500 border-4 border-white shadow-sm">
      {initials}
    </div>
  )
}

interface SocialMedia {
  instagram: string;
  twitter: string;
  linkedin: string;
}

interface BudgetRange {
  min: number;
  max: number;
}

interface TargetAudience {
  ageRange: string;
  interests: string[];
  region: string;
}

interface ProfileForm {
  // Company Overview
  logo: string;
  businessName: string;
  tagline: string;
  industry: string;
  website: string;
  socialMedia: SocialMedia;
  location: string;
  email: string;
  image: string;

  // Sponsorship Preferences
  preferredContentTypes: string[];
  budgetRange: BudgetRange;
  targetAudience: TargetAudience;
  preferredPlatforms: string[];
  campaignGoals: string[];

  // Internal Notes
  notes: string;
}

interface Listing {
  id: number;
  title: string;
  budget: number;
  status: 'OPEN' | 'ACTIVE' | 'DRAFT' | 'CLOSED';
  applications: number;
  createdDate: string;
  public: boolean;
}

interface PreferencesForm {
  budgetMin: number;
  budgetMax: number;
  preferredPlatforms: string[];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>('listings')
  const [profile, setProfile] = useState<ProfileForm | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [editProfile, setEditProfile] = useState(false)
  const [profileForm, setProfileForm] = useState<Partial<ProfileForm>>({})

  const [listings, setListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [listingsError, setListingsError] = useState<string | null>(null)
  const [listingFilter, setListingFilter] = useState<'ALL'|'ACTIVE'|'DRAFT'|'CLOSED'>('ALL')

  const [campaigns, setCampaigns] = useState<any[]>([])
  const [newCampaign, setNewCampaign] = useState({ title: '', roi: '', duration: '', creators: [] as any[] })
  const [creatorSearch, setCreatorSearch] = useState('');
  const [creatorOptions, setCreatorOptions] = useState<any[]>([]);

  const [editPrefs, setEditPrefs] = useState(false)
  const [prefsForm, setPrefsForm] = useState<PreferencesForm>({
    budgetMin: profile?.budgetRange?.min ?? 0,
    budgetMax: profile?.budgetRange?.max ?? 0,
    preferredPlatforms: profile?.preferredPlatforms ?? [],
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        const res = await fetch('/api/auth/profile')
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json() as ProfileForm
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
        const data = await res.json() as Listing[]
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
    if (profile) {
      setPrefsForm({
        budgetMin: profile.budgetRange?.min ?? 0,
        budgetMax: profile.budgetRange?.max ?? 0,
        preferredPlatforms: profile.preferredPlatforms ?? [],
      })
    }
  }, [profile])

  useEffect(() => {
    if (creatorSearch.length > 1) {
      fetch(`/api/matched-creators?search=${encodeURIComponent(creatorSearch)}`)
        .then(res => res.json())
        .then(data => setCreatorOptions(data));
    } else {
      setCreatorOptions([]);
    }
  }, [creatorSearch]);

  const handleProfileChange = (field: keyof ProfileForm, value: any) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  const handleProfileSave = async () => {
    if (!profileForm) return;

    try {
      setProfileLoading(true)
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      const data = await res.json() as ProfileForm
      setProfile(data)
      setEditProfile(false)
    } catch (e: any) {
      setProfileError(e.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePrefsChange = (field: keyof PreferencesForm, value: any) => {
    setPrefsForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePrefsPlatformToggle = (platform: string) => {
    setPrefsForm(prev => ({
      ...prev,
      preferredPlatforms: prev.preferredPlatforms.includes(platform)
        ? prev.preferredPlatforms.filter(p => p !== platform)
        : [...prev.preferredPlatforms, platform],
    }))
  }

  const handlePrefsSave = async () => {
    if (!profile) return;

    try {
      setProfileLoading(true)
      const res = await fetch('/api/auth/profile/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetRange: {
            min: prefsForm.budgetMin,
            max: prefsForm.budgetMax,
          },
          preferredPlatforms: prefsForm.preferredPlatforms,
        }),
      })
      if (!res.ok) throw new Error('Failed to save preferences')
      const data = await res.json() as ProfileForm
      setProfile(data)
      setEditPrefs(false)
    } catch (e: any) {
      setProfileError(e.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/auth/profile/logo', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Failed to upload image')
      const data = await res.json()
      setProfile(prev => prev ? { ...prev, image: data.url } : null)
      setProfileForm(prev => ({ ...prev, image: data.url }))
    } catch (e: any) {
      setProfileError(e.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    handleProfileChange(name as keyof ProfileForm, value)
  }

  const filteredListings = listings.filter(listing => {
    if (listingFilter === 'ALL') return true
    if (listingFilter === 'ACTIVE') return listing.status === 'ACTIVE'
    if (listingFilter === 'DRAFT') return listing.status === 'DRAFT'
    if (listingFilter === 'CLOSED') return listing.status === 'CLOSED'
    return true
  })

  return (
    <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
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
                            alt={profile?.businessName || profile?.email || 'Profile'}
                            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-sm"
                            style={{ backgroundColor: '#ffd97a' }}
                          />
                        ) : profile?.logo ? (
                          <img
                            src={profile.logo}
                            alt={profile?.businessName || profile?.email || 'Profile'}
                            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-sm"
                            style={{ backgroundColor: '#ffd97a' }}
                          />
                        ) : (
                          <div className="h-32 w-32 flex items-center justify-center rounded-full border-4 border-white shadow-sm bg-gray-200">
                            <DefaultAvatar name={profile?.businessName || profile?.email || ''} />
                          </div>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{profile?.businessName || profile?.email || ''}</h2>
                      <p className="text-gray-500 mt-1">{profile?.tagline || ''}</p>
                    </div>

                    {/* Only show website/Instagram buttons if set */}
                    {(profile?.website || (profile?.socialMedia && profile.socialMedia.instagram)) && (
                      <div className="space-y-4">
                        <div className="flex justify-center space-x-3">
                          {profile?.website && (
                            <a
                              href={`https://${profile.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 text-gray-900"
                              style={{ backgroundColor: '#ffd97a' }}
                            >
                              <GlobeAltIcon className="h-4 w-4 mr-2" />
                              Website
                            </a>
                          )}
                          {profile?.socialMedia && profile.socialMedia.instagram && (
                            <a
                              href={`https://instagram.com/${profile.socialMedia.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 text-gray-900"
                              style={{ backgroundColor: '#ffd97a' }}
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Instagram
                            </a>
                          )}
                        </div>
                      </div>
                    )}

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
                      ) : filteredListings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <p className="mb-4 text-gray-500">You have no listings yet.</p>
                          <button
                            onClick={() => router.push('/dashboard/my-listings/create')}
                            className="px-6 py-3 rounded-md bg-[#ffd97a] text-gray-900 font-semibold text-lg shadow hover:bg-[#ffb600] transition"
                          >
                            + Create New Listing
                          </button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          {filteredListings.map(listing => (
                            <div key={listing.id} className="bg-white rounded-lg shadow-sm p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                                  <p className="text-gray-500">Budget: ${listing.budget}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                  listing.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                  listing.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {listing.status}
                                </span>
                              </div>
                              <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    {/* Only show the number of applications, not the object itself */}
                                    {Array.isArray(listing.applications) ? `${listing.applications.length} applications` : `${listing.applications} applications`}
                                </div>
                                <button
                                  onClick={() => router.push(`/dashboard/my-listings/${listing.id}`)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'campaigns' && (
                      <div>
                        <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
                          <h3 className="text-lg font-medium mb-4">Create New Campaign</h3>
                          <form
                            onSubmit={async e => {
                              e.preventDefault();
                              setCampaigns([...campaigns, { ...newCampaign, id: Date.now() }]);
                              // Send invites to selected creators (mock API call)
                              for (const creator of newCampaign.creators) {
                                await axios.post('/api/campaign-invite', { creatorId: creator.id, campaignTitle: newCampaign.title });
                              }
                              setNewCampaign({ title: '', roi: '', duration: '', creators: [] });
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <input type="text" placeholder="Title" required className="rounded border-gray-300 p-2" value={newCampaign.title} onChange={e => setNewCampaign({ ...newCampaign, title: e.target.value })} />
                            <input type="text" placeholder="ROI (e.g. 2.5x)" className="rounded border-gray-300 p-2" value={newCampaign.roi} onChange={e => setNewCampaign({ ...newCampaign, roi: e.target.value })} />
                            <input type="text" placeholder="Duration (e.g. 2 months)" className="rounded border-gray-300 p-2 md:col-span-2" value={newCampaign.duration} onChange={e => setNewCampaign({ ...newCampaign, duration: e.target.value })} />
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Add Creators</label>
                              <input type="text" placeholder="Search creators..." className="rounded border-gray-300 p-2 w-full mb-2" value={creatorSearch} onChange={e => setCreatorSearch(e.target.value)} />
                              <div className="flex flex-wrap gap-2 mb-2">
                                {newCampaign.creators.map((c: any) => (
                                  <span key={c.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-900 bg-yellow-100">
                                    {c.name}
                                    <button type="button" className="ml-2 text-red-500" onClick={() => setNewCampaign({ ...newCampaign, creators: newCampaign.creators.filter((cr: any) => cr.id !== c.id) })}>×</button>
                                  </span>
                                ))}
                              </div>
                              {creatorOptions.length > 0 && (
                                <div className="bg-white border rounded shadow p-2 max-h-40 overflow-y-auto">
                                  {creatorOptions.map((c: any) => (
                                    <div key={c.id} className="cursor-pointer hover:bg-yellow-50 px-2 py-1" onClick={() => {
                                      if (!newCampaign.creators.some((cr: any) => cr.id === c.id)) {
                                        setNewCampaign({ ...newCampaign, creators: [...newCampaign.creators, c] });
                                      }
                                    }}>{c.name} <span className="text-xs text-gray-400">{c.email}</span></div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button type="submit" className="col-span-2 mt-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500">Add Campaign & Invite</button>
                          </form>
                        </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {campaigns.length === 0 && (
                            <div className="text-gray-500 text-center col-span-2">No campaigns yet. Add your first campaign above.</div>
                          )}
                          {campaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-[#ffb600] transition-colors duration-200"
                        >
                          <div className="p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{campaign.title}</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">ROI</span>
                                    <span className="text-sm font-medium" style={{ color: '#ffb600' }}>{campaign.roi}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Duration</span>
                                <span className="text-sm font-medium text-gray-900">{campaign.duration}</span>
                              </div>
                              <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">Creators</span>
                                  <div className="flex -space-x-2">
                                        {campaign.creators.map((c: any, i: number) => (
                                      <div
                                            key={c.id || i}
                                            className="inline-flex items-center justify-center h-6 w-6 rounded-full border-2 border-white text-gray-900 bg-yellow-100"
                                      >
                                            {c.name ? c.name.charAt(0).toUpperCase() : '?'}
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
                          value={profileForm.notes || ''}
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
    </div>
  )
} 