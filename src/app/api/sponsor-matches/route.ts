import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

  const creator = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, categories: true },
  });
  if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

  // Get all sponsors
  const sponsors = await prisma.user.findMany({
    where: { role: 'SPONSOR' },
    include: {
      listings: {
        where: { status: 'OPEN' },
        include: { applications: true },
      },
      applications: true,
      profile: true,
      categories: true,
    },
  });

  // Build sponsor data
  const sponsorData = await Promise.all(sponsors.map(async sponsor => {
    const activeListings = sponsor.listings.length;
    // Successful partnerships: accepted applications for this sponsor's listings
    const successfulPartnerships = sponsor.listings.reduce((acc, l) => acc + l.applications.filter(a => a.status === 'ACCEPTED').length, 0);
    // Budget: sum of open listings
    const budget = sponsor.listings.reduce((acc, l) => acc + (l.budget || 0), 0);
    // Audience match/value alignment: dummy for now
    const audienceMatch = Math.floor(Math.random() * 21) + 80; // 80-100
    const valueMatch = Math.floor(Math.random() * 21) + 80; // 80-100
    // Match score
    const matchScore = calculateMatchScore(creator, sponsor, sponsor.listings);
    return {
      id: sponsor.id,
      name: sponsor.name,
      industry: sponsor.profile?.industry || '',
      logo: sponsor.profile?.logoUrl || '',
      matchScore,
      budget,
      verified: sponsor.verified,
      activeListings,
      successfulPartnerships,
      audienceMatch,
      valueMatch,
      description: sponsor.profile?.bio || '',
      listings: sponsor.listings.map(l => ({
        id: l.id,
        name: l.title,
        type: l.type,
        platform: l.platform,
        audience: l.audience,
        budget: l.budget,
        requirements: l.requirements,
        category: l.category,
        risk: l.risk,
        alignment: l.alignment,
        alignmentScore: l.alignmentScore,
        pros: l.pros,
        cons: l.cons,
        verified: l.verified,
        roi: l.roi,
        rating: l.rating,
        location: l.location,
        date: l.date,
        description: l.description,
        organizer: l.organizer,
        keyActivities: l.keyActivities,
        benefits: l.benefits,
        audienceProfile: l.audienceProfile,
        frequency: l.frequency,
        similarSponsorships: l.similarSponsorships,
        keyMetrics: l.keyMetrics,
      })),
    };
  }));

  return NextResponse.json(sponsorData);
} 