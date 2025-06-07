"use client"

import React, { useState } from 'react';

export default function SponeeRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: '',
    platforms: '',
    audienceSize: '',
    demographics: '',
    niche: '',
    location: '',
    socialLinks: '',
    bio: '',
    mediaKit: null,
    logo: null,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // For now, just log the data
    console.log(form);
    alert('Registration submitted!');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sponee Registration</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Tell us about yourself so we can match you with the best sponsors.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px grid grid-cols-1 gap-4">
            <input name="name" type="text" required placeholder="Your Name" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <input name="email" type="email" required placeholder="Email Address" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <select name="type" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange}>
              <option value="">Type (Influencer, Organization, Event, etc.)</option>
              <option value="Influencer">Influencer</option>
              <option value="Organization">Organization</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
            <input name="platforms" type="text" placeholder="Main Platform(s) (e.g. Instagram, YouTube)" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <input name="audienceSize" type="text" placeholder="Audience Size" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <input name="demographics" type="text" placeholder="Audience Demographics (e.g. 60% US, 55% Female)" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <input name="niche" type="text" placeholder="Niche / Category (e.g. Tech, Fitness)" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <input name="location" type="text" placeholder="Location" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <input name="socialLinks" type="text" placeholder="Social Links (comma separated)" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <textarea name="bio" placeholder="Description / Bio" rows={3} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500" onChange={handleChange} />
            <input name="mediaKit" type="file" accept="application/pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" onChange={handleChange} />
            <input name="logo" type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" onChange={handleChange} />
          </div>
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
            Register
          </button>
        </form>
      </div>
    </div>
  );
} 