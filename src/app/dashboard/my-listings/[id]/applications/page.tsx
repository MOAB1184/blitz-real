"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Application {
  id: string;
  proposal: string;
  status: string;
  user?: {
    name: string | null;
    email: string;
  };
}

interface Listing {
  id: string;
  title: string;
  applications: Application[];
}

export default function ApplicationsPage() {
  const params = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!params?.id) {
        setError('Invalid listing ID');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch listing');
        const data = await res.json();
        setListing(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params?.id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error || !listing) return <div className="p-8 text-red-600">{error || 'Listing not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Applications for: {listing.title}</h1>
      {listing.applications && listing.applications.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Proposal</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {listing.applications.map((app: Application) => (
              <tr key={app.id}>
                <td className="px-4 py-2">{app.user?.name || 'N/A'}</td>
                <td className="px-4 py-2">{app.user?.email || 'N/A'}</td>
                <td className="px-4 py-2">{app.proposal}</td>
                <td className="px-4 py-2">{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No applications yet.</p>
      )}
    </div>
  );
} 