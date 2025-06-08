import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Custom interfaces based on Prisma schema
interface Category {
  id: string;
  name: string;
}

interface ListingWithRelations {
  id: string;
  title: string;
  description: string;
  type: string;
  budget: number;
  requirements: string[];
  perks: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  applications: { id: string; status: string }[];
  categories: { category: Category }[];
}

interface UserWithListings {
  id: string;
  email: string;
  name?: string;
  image?: string;
  bio?: string;
  website?: string;
  socialLinks?: Record<string, any>;
  role: string;
  listings: ListingWithRelations[];
}

interface CreatorProfile {
  audienceProfile?: string | null;
  categories?: string[];
  followers?: number;
}

function calculateMatchScore(
  creator: CreatorProfile,
  sponsor: UserWithListings,
  listings: ListingWithRelations[]
): number {
  let audienceScore = 0;
  let valueScore = 0;
  let requirementsScore = 0;

  // Audience overlap
  if (
    creator.audienceProfile &&
    listings.some((l: ListingWithRelations) =>
      l.description &&
      typeof l.description === 'string' &&
      typeof creator.audienceProfile === 'string' &&
      l.description.includes(creator.audienceProfile)
    )
  ) {
    audienceScore = 100;
  } else {
    audienceScore = 60;
  }

  // Value alignment
  if (
    creator.categories &&
    listings.some((l: ListingWithRelations) =>
      l.categories &&
      l.categories.some((c: { category: Category }) =>
        c.category.name &&
        creator.categories &&
        creator.categories.includes(c.category.name)
      )
    )
  ) {
    valueScore = 100;
  } else {
    valueScore = 60;
  }

  // Requirements match
  if (
    creator.followers &&
    listings.some((l: ListingWithRelations) =>
      l.requirements &&
      l.requirements.some((r: string) =>
        r.toLowerCase().includes('min') &&
        creator.followers &&
        creator.followers >= parseInt(r.replace(/\D/g, ''))
      )
    )
  ) {
    requirementsScore = 100;
  } else {
    requirementsScore = 60;
  }

  return Math.round(
    0.4 * audienceScore + 0.3 * valueScore + 0.3 * requirementsScore
  );
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
          applications: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const listings = user.listings as ListingWithRelations[];

  // Find sponsors that match the creator's profile
  const sponsors = (await prisma.user.findMany({
    where: { role: 'SPONSOR' },
    include: {
      listings: {
        include: {
          applications: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  })) as UserWithListings[];

  const matches = sponsors.filter((sponsor: UserWithListings) => {
    // Match by audience profile
    if (
      user.bio &&
      sponsor.listings.some((l: ListingWithRelations) =>
        l.description &&
        typeof l.description === 'string' &&
        typeof user.bio === 'string' &&
        l.description.includes(user.bio)
      )
    ) {
      return true;
    }

    // Match by category
    if (
      user.socialLinks &&
      sponsor.listings.some((l: ListingWithRelations) =>
        l.categories &&
        l.categories.some((c: { category: Category }) =>
          c.category.name &&
          user.socialLinks &&
          typeof user.socialLinks === 'object' &&
          Object.values(user.socialLinks).some((link) =>
            typeof link === 'string' && link.includes(c.category.name)
          )
        )
      )
    ) {
      return true;
    }

    // Match by follower count
    if (
      user.socialLinks &&
      sponsor.listings.some((l: ListingWithRelations) =>
        l.requirements &&
        l.requirements.some((r: string) =>
          r.toLowerCase().includes('min') &&
          user.socialLinks &&
          typeof user.socialLinks === 'object' &&
          Object.values(user.socialLinks).some((link) =>
            typeof link === 'string' &&
            link.includes('followers') &&
            parseInt(link.replace(/\D/g, '')) >= parseInt(r.replace(/\D/g, ''))
          )
        )
      )
    ) {
      return true;
    }

    return false;
  });

  // Get detailed sponsor data for each match
  const sponsorData = matches.map((sponsor: UserWithListings) => {
    const successfulPartnerships = sponsor.listings.reduce(
      (acc: number, l: ListingWithRelations) =>
        acc + l.applications.filter((a) => a.status === 'ACCEPTED').length,
      0
    );
    const totalListings = sponsor.listings.length;
    const budget = sponsor.listings.reduce(
      (acc: number, l: ListingWithRelations) => acc + (l.budget || 0),
      0
    );
    const matchScore = calculateMatchScore(
      user as CreatorProfile,
      sponsor,
      sponsor.listings
    );

    return {
      id: sponsor.id,
      name: sponsor.name || 'Unknown Sponsor',
      email: sponsor.email,
      image: sponsor.image,
      matchScore,
      stats: {
        successfulPartnerships,
        totalListings,
        averageBudget: totalListings > 0 ? budget / totalListings : 0,
      },
      listings: sponsor.listings.map((l: ListingWithRelations) => ({
        id: l.id,
        title: l.title || 'Untitled Listing',
        budget: l.budget || 0,
      })),
    };
  });

  // Sort by match score descending
  sponsorData.sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json(sponsorData);
}

