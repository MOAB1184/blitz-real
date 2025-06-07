import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface Listing {
  id: string;
  audienceProfile?: string;
  category?: string;
  requirements?: string[];
  budget?: number;
  applications: Application[];
}

interface Application {
  status: string;
}

interface Creator {
  audienceProfile?: string;
  categories?: string[];
  followers?: number;
}

interface Sponsor {
  id: string;
  name: string;
  email: string;
  image: string | null;
  listings: Listing[];
}

function calculateMatchScore(creator, sponsor, listings) {
  // Example: 40% audience, 30% value, 30% requirements
  let audienceScore = 0;
  let valueScore = 0;
  let requirementsScore = 0;

  // Audience overlap (dummy: if any audienceProfile matches, 100, else 0)
  if (creator.audienceProfile && listings.some(l => l.audienceProfile && l.audienceProfile.includes(creator.audienceProfile))) {
    audienceScore = 100;
  } else {
    audienceScore = 60; // fallback
  }

  // Value alignment (dummy: if any category matches, 100, else 0)
  if (creator.categories && listings.some(l => l.category && creator.categories.includes(l.category))) {
    valueScore = 100;
  } else {
    valueScore = 60;
  }

  // Requirements match (dummy: if creator meets min followers, 100, else 0)
  if (creator.followers && listings.some(l => l.requirements && l.requirements.some(r => r.toLowerCase().includes('min') && creator.followers >= parseInt(r.replace(/\D/g, ''))))) {
    requirementsScore = 100;
  } else {
    requirementsScore = 60;
  }

  return Math.round(0.4 * audienceScore + 0.3 * valueScore + 0.3 * requirementsScore);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { listings: true }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const listings = user.listings;

  // Find creators that match the sponsor's requirements
  const creators = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    include: { listings: true }
  });

  const matches = creators.filter((creator: Creator) => {
    // Match by audience profile
    if (creator.audienceProfile && listings.some((l: Listing) => l.audienceProfile && l.audienceProfile.includes(creator.audienceProfile))) {
      return true;
    }

    // Match by category
    if (creator.categories && listings.some((l: Listing) => l.category && creator.categories?.includes(l.category))) {
      return true;
    }

    // Match by follower count
    if (creator.followers && listings.some((l: Listing) => l.requirements && l.requirements.some((r: string) => r.toLowerCase().includes('min') && creator.followers && creator.followers >= parseInt(r.replace(/\D/g, ''))))) {
      return true;
    }

    return false;
  });

  // Get detailed sponsor data for each match
  const sponsorData = await Promise.all(matches.map(async (sponsor: Sponsor) => {
    const successfulPartnerships = sponsor.listings.reduce((acc: number, l: Listing) => acc + l.applications.filter((a: Application) => a.status === 'ACCEPTED').length, 0);
    const totalListings = sponsor.listings.length;
    const budget = sponsor.listings.reduce((acc: number, l: Listing) => acc + (l.budget || 0), 0);

    return {
      id: sponsor.id,
      name: sponsor.name,
      email: sponsor.email,
      image: sponsor.image,
      stats: {
        successfulPartnerships,
        totalListings,
        averageBudget: totalListings > 0 ? budget / totalListings : 0
      },
      listings: sponsor.listings.map((l: Listing) => ({
        id: l.id,
        title: l.title,
        budget: l.budget
      }))
    };
  }));

  return NextResponse.json(sponsorData);
} 