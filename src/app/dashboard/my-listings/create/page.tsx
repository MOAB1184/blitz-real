'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

interface FormData {
  title: string
  description: string
  type: 'SPONSORSHIP' | 'COLLABORATION' | 'PARTNERSHIP'
  budget: string
  requirements: string[]
  perks: string[]
  categories: string[]
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

export default function CreateListingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'SPONSORSHIP',
    budget: '',
    requirements: [''],
    perks: [''],
    categories: []
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
  }, [session, status])

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!session?.user) {
      setError('You must be logged in to create a listing')
      return
    }

    try {
      console.log('Submitting form with data:', formData)
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create listing')
      }

    router.push('/dashboard/my-listings')
    } catch (error) {
      console.error('Error creating listing:', error)
      setError(error instanceof Error ? error.message : 'Failed to create listing')
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }))
  }

  const addPerk = () => {
    setFormData(prev => ({
      ...prev,
      perks: [...prev.perks, '']
    }))
  }

  const removePerk = (index: number) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index)
    }))
  }

  const updatePerk = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.map((perk, i) => i === index ? value : perk)
    }))
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
          <select
          id="type"
          value={formData.type}
          onChange={(e) => updateFormData('type', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
          <option value="SPONSORSHIP">Sponsorship</option>
          <option value="COLLABORATION">Collaboration</option>
          <option value="PARTNERSHIP">Partnership</option>
          </select>
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
          Budget
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="budget"
            value={formData.budget}
            onChange={(e) => updateFormData('budget', e.target.value)}
            className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
          Categories
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                const newCategories = formData.categories.includes(category)
                  ? formData.categories.filter(c => c !== category)
                  : [...formData.categories, category]
                updateFormData('categories', newCategories)
              }}
              className={`relative flex items-center justify-center rounded-lg border p-4 focus:outline-none ${
                formData.categories.includes(category)
                  ? 'border-primary ring-2 ring-primary'
                  : 'border-gray-300'
              }`}
            >
              <span className="text-sm font-medium text-gray-900">{category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
          <textarea
          id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
          />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Requirements
        </label>
        <div className="mt-2 space-y-2">
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={req}
                onChange={(e) => updateRequirement(index, e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter a requirement"
          />
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Requirement
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Perks
        </label>
        <div className="mt-2 space-y-2">
          {formData.perks.map((perk, index) => (
            <div key={index} className="flex gap-2">
          <input
            type="text"
                value={perk}
                onChange={(e) => updatePerk(index, e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter a perk"
              />
            <button
              type="button"
                onClick={() => removePerk(index)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                Remove
            </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPerk}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Perk
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Create New Listing</h1>
            <p className="mt-4 text-base text-gray-500">
              Fill out the form below to create a new listing.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-8">
            <div className="grid grid-cols-3 text-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      currentStep >= step ? 'bg-primary text-gray-900' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step}
                  </button>
                  <div className="mt-2 text-sm font-medium text-gray-700">
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Requirements'}
                    {step === 3 && 'Perks'}
                  </div>
                </div>
              ))}
            </div>
          </div>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:opacity-90"
                >
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:opacity-90"
                >
                Create Listing
                </button>
              )}
            </div>
          </form>
      </div>
    </div>
  )
} 