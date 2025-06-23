"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "profilePicture",
  "bio",
  "niche",
  "platforms",
];

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    profilePicture: null as File | null,
    bio: "",
    niche: "",
    platforms: "",
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
    
    try {
      // Send form data to backend
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: form.bio,
          socialLinks: {
            niche: form.niche,
            platforms: form.platforms
          }
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
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
              <label className="block text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
              <input 
                name="profilePicture" 
                type="file" 
                accept="image/*" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                onChange={handleChange} 
              />
              <p className="mt-1 text-sm text-gray-500">You can add this later in your profile settings</p>
            </div>
          )}
          
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea 
                name="bio" 
                rows={3} 
                className="w-full rounded border-gray-300 p-2" 
                placeholder="Tell sponsors about yourself and your content" 
                value={form.bio} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Content Niche / Categories</label>
              <input 
                name="niche" 
                type="text" 
                className="w-full rounded border-gray-300 p-2" 
                placeholder="e.g. Tech, Beauty, Gaming, Fitness" 
                value={form.niche} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          
          {step === 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform Links (Optional)</label>
              <input 
                name="platforms" 
                type="text" 
                className="w-full rounded border-gray-300 p-2" 
                placeholder="e.g. YouTube, Instagram, TikTok links" 
                value={form.platforms} 
                onChange={handleChange} 
              />
              <p className="mt-1 text-sm text-gray-500">You can add these later in your profile settings</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-8">
          <button 
            type="button" 
            onClick={prevStep} 
            disabled={step === 0} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          {step < steps.length - 1 ? (
            <button 
              type="button" 
              onClick={nextStep} 
              className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark" 
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-dark" 
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Finish
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 