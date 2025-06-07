import React from 'react';

const michaelProfile = {
  name: 'Michael Thompson',
  title: "Owner, Michael's Family Restaurant",
  about:
    "I'm a proud local business owner passionate about supporting my community while growing my restaurant. My mission is to make a positive impact in Springfield by partnering with local events, teams, and creators.",
  journey:
    "Sponsoring local events and organizations used to be time-consuming and overwhelming. With Blitz, I can easily discover and support causes that matter to me—like the Springfield Soccer Team. My sponsorship puts my logo on jerseys, banners at games, and more, helping both my business and the community thrive.",
  partnerships: [
    {
      name: 'Springfield Soccer Team',
      result: 'Logo on jerseys, banners at games, increased local foot traffic, and positive community buzz.',
      year: 2025,
    },
    {
      name: 'Downtown Art Walk',
      result: 'Restaurant featured as a sponsor, special event menu, and new local customers.',
      year: 2023,
    },
  ],
  expertise: [
    'Community Support',
    'Local Marketing',
    'Small Business Growth',
    'Event Sponsorship',
    'Family-Friendly Initiatives',
  ],
  listings: [
    {
      id: 1,
      title: 'Sponsor Local Youth Sports',
      budget: '$1,000',
      status: 'Active',
      applications: 4,
      date: '2025-06-01',
    },
    {
      id: 2,
      title: 'Support Community Art Events',
      budget: '$500',
      status: 'Closed',
      applications: 7,
      date: '2023-11-15',
    },
  ],
  applicants: [
    {
      name: 'Springfield Youth Basketball',
      dealHistory: '3 successful sponsorships',
      reviews: 5,
      rating: 4.8,
      aiAnalysis: "Strong engagement, high community reach, aligns with Michael's family-friendly values. Low risk, high local impact.",
    },
    {
      name: 'Local Art Collective',
      dealHistory: '2 events sponsored',
      reviews: 3,
      rating: 4.5,
      aiAnalysis: 'Creative audience, good engagement, moderate risk due to smaller reach, but strong local reputation.',
    },
  ],
  contact: {
    email: 'michael@springfieldrestaurant.com',
    website: 'www.springfieldrestaurant.com',
    location: 'Springfield, USA',
  },
};

export default function AccountsPage() {
  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto py-10 px-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700 mr-4">
            M
          </div>
          <div>
            <h1 className="text-2xl font-bold">{michaelProfile.name}</h1>
            <p className="text-gray-600">{michaelProfile.title}</p>
          </div>
        </div>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p>{michaelProfile.about}</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Content Journey</h2>
          <p>{michaelProfile.journey}</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Brand Partnerships</h2>
          <ul className="space-y-2">
            {michaelProfile.partnerships.map((p, i) => (
              <li key={i} className="bg-gray-50 p-3 rounded">
                <div className="font-semibold">{p.name} ({p.year})</div>
                <div className="text-sm text-gray-600">{p.result}</div>
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Areas of Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {michaelProfile.expertise.map((area, i) => (
              <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded text-sm font-semibold shadow-sm">{area}</span>
            ))}
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">My Sponsorship Listings</h2>
          <table className="w-full text-left border rounded">
            <thead style={{ backgroundColor: 'var(--background-light)' }}>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Budget
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Applications
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th scope="col" className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200" style={{ backgroundColor: 'var(--background)' }}>
              {michaelProfile.listings.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-2 font-semibold">{l.title}</td>
                  <td className="p-2">{l.budget}</td>
                  <td className="p-2">{l.status}</td>
                  <td className="p-2">{l.applications}</td>
                  <td className="p-2">{l.date}</td>
                  <td className="p-2 flex gap-2">
                    <button className="rounded bg-indigo-600 px-2 py-1 text-white text-xs font-semibold hover:bg-indigo-700">Edit</button>
                    <button className="rounded bg-red-600 px-2 py-1 text-white text-xs font-semibold hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Applicants & AI Review</h2>
          <ul className="space-y-3">
            {michaelProfile.applicants.map((a, i) => (
              <li key={i} className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--background-light)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-blue-700">{a.name}</div>
                    <div className="text-xs text-gray-500">Deal History: {a.dealHistory}</div>
                    <div className="text-xs text-gray-500">Reviews: {a.reviews} | Rating: {a.rating}</div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-xs text-gray-700 font-semibold">AI Analysis:</div>
                    <div className="text-xs text-gray-700">{a.aiAnalysis}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <div>Email: <a href={`mailto:${michaelProfile.contact.email}`} className="text-green-700 underline">{michaelProfile.contact.email}</a></div>
          <div>Website: <a href={`https://${michaelProfile.contact.website}`} className="text-green-700 underline" target="_blank" rel="noopener noreferrer">{michaelProfile.contact.website}</a></div>
          <div>Location: {michaelProfile.contact.location}</div>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Blitz AI for Sponsors</h2>
          <div className="bg-gradient-to-r from-green-100 to-blue-50 border-l-4 border-green-400 p-4 rounded shadow-sm">
            <h3 className="font-bold text-green-700 mb-1">How Blitz AI Helps Michael</h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Discovers relevant local events, influencers, and organizations to sponsor</li>
              <li>Suggests opportunities based on Michael's goals and budget</li>
              <li>Analyzes applicants: highlights pros, cons, engagement, and community reach</li>
              <li>Automates tax write-offs for sponsorships</li>
              <li>Saves hours of research and decision-making</li>
              <li>Ensures every sponsorship is a great fit for Michael's business and values</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 