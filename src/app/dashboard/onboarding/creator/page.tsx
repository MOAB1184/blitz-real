"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "profilePicture",
  "bio",
  "niche",
  "platforms",
  "audience",
  "engagement",
  "collaborations",
  "samples",
  "rates",
];

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    profilePicture: null as File | null,
    bio: "",
    niche: "",
    platforms: "",
    audience: "",
    engagement: "",
    collaborations: "",
    samples: "",
    rates: "",
  });
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Send form data to backend
    await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio: form.bio,
        niche: form.niche,
        platforms: form.platforms,
        audience: form.audience,
        engagement: form.engagement,
        collaborations: form.collaborations,
        samples: form.samples,
        rates: form.rates
      }),
    });
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Profile Created!</h2>
          <p className="mt-2 text-lg text-gray-600">You're ready to start applying for sponsorships!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <form onSubmit={handleSubmit} className={`w-full max-w-lg bg-white p-8 rounded-lg shadow transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Set Up Your Creator Profile</h2>
          <p className="mt-2 text-lg text-gray-600">Tell us about yourself to help sponsors find you!</p>
        </div>
        <div className="space-y-6">
          {step === 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input name="profilePicture" type="file" accept="image/*" className="w-full" onChange={handleChange} />
            </div>
          )}
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea name="bio" rows={3} className="w-full rounded border-gray-300" placeholder="Tell sponsors about yourself and your content" value={form.bio} onChange={handleChange} required />
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Content Niche / Categories</label>
              <input name="niche" type="text" className="w-full rounded border-gray-300" placeholder="e.g. Tech, Beauty, Gaming" value={form.niche} onChange={handleChange} required />
            </div>
          )}
          {step === 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform Links</label>
              <input name="platforms" type="text" className="w-full rounded border-gray-300" placeholder="e.g. YouTube, Instagram, TikTok links" value={form.platforms} onChange={handleChange} required />
            </div>
          )}
          {step === 4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Audience Size / Demographics</label>
              <input name="audience" type="text" className="w-full rounded border-gray-300" placeholder="e.g. 50k followers, 60% US, 40% female" value={form.audience} onChange={handleChange} required />
            </div>
          )}
          {step === 5 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Engagement Metrics</label>
              <input name="engagement" type="text" className="w-full rounded border-gray-300" placeholder="e.g. 5% engagement rate" value={form.engagement} onChange={handleChange} required />
            </div>
          )}
          {step === 6 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Previous Brand Collaborations</label>
              <input name="collaborations" type="text" className="w-full rounded border-gray-300" placeholder="e.g. Nike, Samsung" value={form.collaborations} onChange={handleChange} />
            </div>
          )}
          {step === 7 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Content Samples</label>
              <input name="samples" type="text" className="w-full rounded border-gray-300" placeholder="Links to your best work" value={form.samples} onChange={handleChange} />
            </div>
          )}
          {step === 8 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Rate Card / Pricing</label>
              <input name="rates" type="text" className="w-full rounded border-gray-300" placeholder="e.g. $500 per video" value={form.rates} onChange={handleChange} />
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8">
          <button type="button" onClick={prevStep} disabled={step === 0} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark">Back</button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={nextStep} className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark" style={{ backgroundColor: 'var(--primary)' }}>Next</button>
          ) : (
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark" style={{ backgroundColor: 'var(--primary)' }}>Finish</button>
          )}
        </div>
      </form>
    </div>
  );
} 