import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session in POST /api/listings:', session)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    console.log('Request data:', data)

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        budget: parseFloat(data.budget),
        requirements: data.requirements,
        perks: data.perks,
        status: 'OPEN',
        creator: {
          connect: {
            id: session.user.id
          }
        },
        categories: {
          create: data.categories.map((categoryName: string) => ({
            category: {
              connectOrCreate: {
                where: { name: categoryName },
                create: { name: categoryName }
              }
            }
          }))
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        categories: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json(listing)
  } catch (error: any) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const mine = searchParams.get('mine')
    const minBudget = searchParams.get('minBudget')
    const maxBudget = searchParams.get('maxBudget')

    let where: any = {}

    if (mine === '1') {
      // Get current user from session
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      where.creatorId = session.user.id
    } else {
      where.status = 'OPEN'
      if (type) where.type = type
      if (category) {
        where.categories = {
          some: {
            category: {
              name: category
            }
          }
        }
      }
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
      if (minBudget) {
        where.budget = { ...(where.budget || {}), gte: parseFloat(minBudget) }
      }
      if (maxBudget) {
        where.budget = { ...(where.budget || {}), lte: parseFloat(maxBudget) }
      }
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        applications: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(listings)
  } catch (error: any) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
} 