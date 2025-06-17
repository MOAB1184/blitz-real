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
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  if (!search || search.length < 1) {
    return NextResponse.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
      role: 'CREATOR',
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    take: 10,
  });

  return NextResponse.json(users);
}

