"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

const steps = [
  'budget',
  'preferences',
  'profilePicture',
  'firstListing',
  'firstCampaign',
  'notes',
];

export default function RegisterSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    budgetMin: '',
    budgetMax: '',
    sponsorshipPreferences: '',
    profilePicture: null as File | null,
    firstListing: '',
    firstCampaign: '',
    notes: '',
  });
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    // Save profile data including image
    await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: profilePictureUrl,
        // ...other profile fields as needed
      }),
    });
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Finish Account Setup</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Tell us a bit more to personalize your experience.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm grid grid-cols-1 gap-4 relative min-h-[120px]">
            {/* Stepper animation container */}
            <div className={`transition-all duration-300 ease-in-out ${animating ? 'opacity-0 translate-x-8 pointer-events-none' : 'opacity-100 translate-x-0'}`} key={step}>
              {step === 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                  <div className="flex gap-2">
                    <input name="budgetMin" type="number" required placeholder="Min" className="w-1/2 rounded border-gray-300" value={form.budgetMin} onChange={handleChange} />
                    <input name="budgetMax" type="number" required placeholder="Max" className="w-1/2 rounded border-gray-300" value={form.budgetMax} onChange={handleChange} />
                  </div>
                </div>
              )}
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sponsorship Preferences</label>
                  <textarea name="sponsorshipPreferences" rows={2} className="w-full rounded border-gray-300" placeholder="e.g. Content types, platforms, goals" value={form.sponsorshipPreferences} onChange={handleChange} />
                </div>
              )}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Picture (optional)</label>
                  <input name="profilePicture" type="file" accept="image/*" className="w-full" onChange={handleChange} />
                </div>
              )}
              {step === 3 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Listing (optional)</label>
                  <input name="firstListing" type="text" className="w-full rounded border-gray-300" placeholder="Describe your first sponsorship opportunity" value={form.firstListing} onChange={handleChange} />
                </div>
              )}
              {step === 4 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Campaign (optional)</label>
                  <input name="firstCampaign" type="text" className="w-full rounded border-gray-300" placeholder="Describe your first campaign" value={form.firstCampaign} onChange={handleChange} />
                </div>
              )}
              {step === 5 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                  <textarea name="notes" rows={2} className="w-full rounded border-gray-300" placeholder="Add any notes or goals" value={form.notes} onChange={handleChange} />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            {step > 0 && <button type="button" onClick={prevStep} className="px-4 py-2 rounded bg-gray-200 text-gray-700">Back</button>}
            {step < steps.length - 1 && <button type="button" onClick={nextStep} className="ml-auto px-4 py-2 rounded bg-indigo-600 text-white">Next</button>}
            {step === steps.length - 1 && <button type="submit" className="ml-auto px-4 py-2 rounded bg-indigo-600 text-white">Finish Setup</button>}
          </div>
          {success && <div className="text-green-600 text-center mt-2">Setup complete! Redirecting...</div>}
        </form>
      </div>
    </div>
  );
} 