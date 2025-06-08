export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface Listing {
  id: string;
  title: string;
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
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  audienceProfile?: string;
  categories?: string[];
  followers?: number;
  engagement?: number;
  listings: Listing[];
  applications: Application[];
}

interface Sponsor {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  listings: Listing[];
}

interface CreatorResult {
  id: string;
  name: string;
  email: string;
  image: string | null;
  matchScore: number;
  stats: {
    followers: number;
    engagement: number;
    contentCount: number;
  };
  categories: string[];
}

function calculateMatchScore(sponsor: Sponsor, creator: Creator): number {
  // Calculate match score based on audience, value, and requirements
  let audienceScore = 0;
  let valueScore = 0;
  let requirementsScore = 0;

  // Audience overlap
  if (sponsor.listings.some(l => 
    l.audienceProfile && 
    creator.audienceProfile && 
    typeof l.audienceProfile === 'string' && 
    typeof creator.audienceProfile === 'string' && 
    l.audienceProfile.includes(creator.audienceProfile)
  )) {
    audienceScore = 100;
  } else {
    audienceScore = 60;
  }

  // Value alignment
  if (creator.categories && sponsor.listings.some(l => 
    l.category && 
    typeof l.category === 'string' && 
    creator.categories && 
    creator.categories.includes(l.category)
  )) {
    valueScore = 100;
  } else {
    valueScore = 60;
  }

  // Requirements match
  if (creator.followers && sponsor.listings.some(l => l.requirements && l.requirements.some(r => r.toLowerCase().includes('min') && creator.followers && creator.followers >= parseInt(r.replace(/\D/g, ''))))) {
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
    include: { 
      listings: {
        include: {
          applications: true
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.role !== 'SPONSOR') {
    return NextResponse.json({ error: 'Only sponsors can view matched creators' }, { status: 403 });
  }

  // Find creators that match the sponsor's requirements
  const creators = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    include: { 
      listings: {
        include: {
          applications: true
        }
      },
      applications: true
    }
  });

  const matches = creators.filter((creator: Creator) => {
    // Match by audience profile
    if (creator.audienceProfile && user.listings.some((l: Listing) => 
      l.audienceProfile && 
      typeof l.audienceProfile === 'string' && 
      typeof creator.audienceProfile === 'string' && 
      l.audienceProfile.includes(creator.audienceProfile)
    )) {
      return true;
    }

    // Match by category
    if (creator.categories && user.listings.some((l: Listing) => 
      l.category && 
      typeof l.category === 'string' && 
      creator.categories && 
      creator.categories.includes(l.category)
    )) {
      return true;
    }

    // Match by follower count
    if (creator.followers && user.listings.some((l: Listing) => l.requirements && l.requirements.some((r: string) => r.toLowerCase().includes('min') && creator.followers && creator.followers >= parseInt(r.replace(/\D/g, ''))))) {
      return true;
    }

    return false;
  });

  // Get detailed creator data for each match
  const creatorData: CreatorResult[] = matches.map((creator: Creator) => {
    const contentCount = creator.listings.length;
    const matchScore = calculateMatchScore(user as Sponsor, creator);

    return {
      id: creator.id,
      name: creator.name || 'Anonymous Creator',
      email: creator.email,
      image: creator.image,
      matchScore,
      stats: {
        followers: creator.followers || 0,
        engagement: creator.engagement || 0,
        contentCount
      },
      categories: creator.categories || []
    };
  });

  // Sort by match score descending
  creatorData.sort((a: { matchScore: number }, b: { matchScore: number }) => b.matchScore - a.matchScore);

  return NextResponse.json(creatorData);
}

