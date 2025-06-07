'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface ProfileForm {
  businessName: string
  logo: File | null
  logoPreview: string | null
  website: string
  industry: string
  about: string
  location: string
}

const industries = [
  'Technology',
  'Food & Beverage',
  'Fashion & Beauty',
  'Health & Wellness',
  'Entertainment',
  'Education',
  'Sports & Fitness',
  'Travel & Tourism',
  'Finance',
  'Other'
]

export default function SponsorProfileSetupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileForm>({
    businessName: '',
    logo: null,
    logoPreview: null,
    website: '',
    industry: '',
    about: '',
    location: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoPreview: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Redirect after success message
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Profile Created!</h2>
          <p className="mt-2 text-lg text-gray-600">
            You're ready to create a listing when you're ready to sponsor!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Set Up Your Sponsor Profile</h2>
          <p className="mt-2 text-lg text-gray-600">
            Tell us about your business to help us find the perfect creators and events for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business or Brand Name
            </label>
            <input
              type="text"
              name="businessName"
              id="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-warm-dark focus:ring-warm-dark sm:text-sm"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo (Optional)</label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-shrink-0">
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt="Logo preview"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-warm-light file:text-warm-dark hover:file:bg-warm-dark hover:file:text-white"
                />
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website or Social Handles
            </label>
            <input
              type="text"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g., www.example.com or @handle"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-warm-dark focus:ring-warm-dark sm:text-sm"
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry Category
            </label>
            <select
              name="industry"
              id="industry"
              required
              value={formData.industry}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-warm-dark focus:ring-warm-dark sm:text-sm"
            >
              <option value="">Select an industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
              About You
            </label>
            <textarea
              name="about"
              id="about"
              rows={4}
              required
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about what kinds of creators and events you're interested in supporting..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-warm-dark focus:ring-warm-dark sm:text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location / Region Focus
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York City, NY or West Coast"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-warm-dark focus:ring-warm-dark sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/browse')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 