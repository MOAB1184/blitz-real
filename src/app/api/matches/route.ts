import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

interface CategoryWithRelations {
  id: string;
  listingId: string;
  categoryId: string;
}

interface ListingWithRelations {
  id: string;
  title: string;
  description: string;
  type: 'SPONSORSHIP' | 'COLLABORATION' | 'PARTNERSHIP';
  budget: number;
  requirements: string[];
  perks: string[];
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  categories: CategoryWithRelations[];
}

interface ApplicationWithRelations {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  listingId: string;
  proposal: string;
  userId: string;
  listing: {
    title: string;
  };
}

interface UserWithRelations {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: 'CREATOR' | 'SPONSOR' | 'ADMIN';
  listings: ListingWithRelations[];
  applications: ApplicationWithRelations[];
  updatedAt: Date;
}

interface MatchResult {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  lastActivity: string;
  engagement: string;
}

function daysAgo(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return '1 day ago'
  return `${diff} days ago`
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      listings: { 
        include: { 
          categories: true 
        } 
      }, 
      applications: {
        include: {
          listing: {
            select: {
              title: true
            }
          }
        }
      }
    }
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Determine role and matching logic
  let matches: MatchResult[] = []
  if (user.role === 'SPONSOR') {
    // Find creators with shared categories or region
    const sponsorCategories = user.listings.flatMap((l: ListingWithRelations) => 
      l.categories.map((c: CategoryWithRelations) => c.categoryId)
    )
    const creators = await prisma.user.findMany({
      where: { role: 'CREATOR' },
      include: { 
        listings: { 
          include: { 
            categories: true 
          } 
        }, 
        applications: {
          include: {
            listing: {
              select: {
                title: true
              }
            }
          }
        }
      }
    })
    matches = creators.map((creator: UserWithRelations): MatchResult => {
      // Last activity: latest of updatedAt, last application, last listing
      const lastApp = creator.applications.reduce((max: Date, a: ApplicationWithRelations) => a.updatedAt > max ? a.updatedAt : max, creator.updatedAt)
      const lastListing = creator.listings.reduce((max: Date, l: ListingWithRelations) => l.updatedAt > max ? l.updatedAt : max, creator.updatedAt)
      const lastActivity = new Date(Math.max(new Date(lastApp).getTime(), new Date(lastListing).getTime(), new Date(creator.updatedAt).getTime()))
      // Engagement: # of applications in last 30 days
      const engagement = creator.applications.filter((a: ApplicationWithRelations) => new Date(a.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length / 30 * 100
      return {
        id: creator.id,
        name: creator.name || 'Anonymous',
        email: creator.email,
        image: creator.image,
        role: creator.role,
        lastActivity: daysAgo(lastActivity),
        engagement: engagement.toFixed(1),
      }
    })
  } else if (user.role === 'CREATOR') {
    // Find sponsors with shared categories or region
    const creatorCategories = user.listings.flatMap((l: ListingWithRelations) => 
      l.categories.map((c: CategoryWithRelations) => c.categoryId)
    )
    const sponsors = await prisma.user.findMany({
      where: { role: 'SPONSOR' },
      include: { 
        listings: { 
          include: { 
            categories: true 
          } 
        }, 
        applications: {
          include: {
            listing: {
              select: {
                title: true
              }
            }
          }
        }
      }
    })
    matches = sponsors.map((sponsor: UserWithRelations): MatchResult => {
      const lastApp = sponsor.applications.reduce((max: Date, a: ApplicationWithRelations) => a.updatedAt > max ? a.updatedAt : max, sponsor.updatedAt)
      const lastListing = sponsor.listings.reduce((max: Date, l: ListingWithRelations) => l.updatedAt > max ? l.updatedAt : max, sponsor.updatedAt)
      const lastActivity = new Date(Math.max(new Date(lastApp).getTime(), new Date(lastListing).getTime(), new Date(sponsor.updatedAt).getTime()))
      const engagement = sponsor.listings.filter((l: ListingWithRelations) => new Date(l.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length / 30 * 100
      return {
        id: sponsor.id,
        name: sponsor.name || 'Anonymous',
        email: sponsor.email,
        image: sponsor.image,
        role: sponsor.role,
        lastActivity: daysAgo(lastActivity),
        engagement: engagement.toFixed(1),
      }
    })
  }
  return NextResponse.json(matches)
}

