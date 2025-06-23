"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const steps = [
  'basic-info',
  'social-links',
  'profile-picture',
  'first-listing',
];

export default function RegisterSetupPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    bio: '',
    website: '',
    socialLinks: {
      instagram: '',
      tiktok: '',
      youtube: '',
      twitter: '',
      linkedin: '',
    },
    profilePicture: null as File | null,
    firstListing: {
      title: '',
      description: '',
      budget: '',
      requirements: [] as string[],
    },
  });
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (session?.user?.role !== 'CREATOR') {
      router.push('/dashboard');
    }
  }, [session, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, files } = e.target as HTMLInputElement;
    
    if (name.startsWith('socialLinks.')) {
      const socialPlatform = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value,
        },
      }));
    } else if (name.startsWith('firstListing.')) {
      const listingField = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        firstListing: {
          ...prev.firstListing,
          [listingField]: value,
        },
      }));
    } else if (files) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function nextStep() {
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 350);
  }

  function prevStep() {
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setAnimating(false);
    }, 350);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload profile picture if provided
      let profilePictureUrl = '';
      if (form.profilePicture) {
        const formData = new FormData();
        formData.append('image', form.profilePicture);
        const res = await fetch('/api/auth/profile/logo', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          profilePictureUrl = data.url;
        }
      }

      // Update user profile
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: form.bio,
          website: form.website,
          socialLinks: form.socialLinks,
          image: profilePictureUrl,
        }),
      });

      // Create first listing if provided
      if (form.firstListing.title && form.firstListing.description) {
        await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.firstListing.title,
            description: form.firstListing.description,
            budget: parseFloat(form.firstListing.budget) || 0,
            requirements: form.firstListing.requirements,
            type: 'SPONSORSHIP',
          }),
        });
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error('Setup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!session?.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Complete Your Creator Profile</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Help sponsors find you by completing your profile.</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full ${
                index <= step ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm grid grid-cols-1 gap-4 relative min-h-[120px]">
            <div className={`transition-all duration-300 ease-in-out ${animating ? 'opacity-0 translate-x-8 pointer-events-none' : 'opacity-100 translate-x-0'}`} key={step}>
              
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea 
                      name="bio" 
                      rows={3} 
                      className="w-full rounded border-gray-300" 
                      placeholder="Tell sponsors about yourself, your content, and your audience..." 
                      value={form.bio} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website (optional)</label>
                    <input 
                      name="website" 
                      type="url" 
                      className="w-full rounded border-gray-300" 
                      placeholder="https://yourwebsite.com" 
                      value={form.website} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Add your social media links to help sponsors discover you</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input 
                      name="socialLinks.instagram" 
                      type="text" 
                      className="w-full rounded border-gray-300" 
                      placeholder="@yourusername" 
                      value={form.socialLinks.instagram} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">TikTok</label>
                    <input 
                      name="socialLinks.tiktok" 
                      type="text" 
                      className="w-full rounded border-gray-300" 
                      placeholder="@yourusername" 
                      value={form.socialLinks.tiktok} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">YouTube</label>
                    <input 
                      name="socialLinks.youtube" 
                      type="text" 
                      className="w-full rounded border-gray-300" 
                      placeholder="Channel name or URL" 
                      value={form.socialLinks.youtube} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter/X</label>
                    <input 
                      name="socialLinks.twitter" 
                      type="text" 
                      className="w-full rounded border-gray-300" 
                      placeholder="@yourusername" 
                      value={form.socialLinks.twitter} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                    <input 
                      name="socialLinks.linkedin" 
                      type="text" 
                      className="w-full rounded border-gray-300" 
                      placeholder="Profile URL" 
                      value={form.socialLinks.linkedin} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Picture (optional)</label>
                  <input 
                    name="profilePicture" 
                    type="file" 
                    accept="image/*" 
                    className="w-full" 
                    onChange={handleChange} 
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be your profile picture across the platform</p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Create your first sponsorship listing (optional)</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Listing Title</label>
                    <input 
                      name="firstListing.title" 
                      type="text" 
                      className="w-full rounded border-gray-300" 
                      placeholder="e.g., Instagram Story Sponsorship" 
                      value={form.firstListing.title} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      name="firstListing.description" 
                      rows={3} 
                      className="w-full rounded border-gray-300" 
                      placeholder="Describe what you're offering to sponsors..." 
                      value={form.firstListing.description} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                    <input 
                      name="firstListing.budget" 
                      type="number" 
                      className="w-full rounded border-gray-300" 
                      placeholder="e.g., 500" 
                      value={form.firstListing.budget} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            {step > 0 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Back
              </button>
            )}
            {step < steps.length - 1 && (
              <button 
                type="button" 
                onClick={nextStep} 
                className="ml-auto px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next
              </button>
            )}
            {step === steps.length - 1 && (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="ml-auto px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Complete Setup'}
              </button>
            )}
          </div>

          {success && (
            <div className="text-green-600 text-center mt-2">
              Setup complete! Redirecting to dashboard...
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 