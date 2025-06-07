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

interface CategoryConnectOrCreate {
  where: { name: string };
  create: { name: string };
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
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

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to update this listing' }, { status: 403 })
    }

    const { title, description, type, budget, requirements, perks, categories } = await req.json()

    // Validate categories
    const validCategories = (categories || []).filter((name: string) => !!name && typeof name === 'string')
    const categoryConnectOrCreate = validCategories.map((name: string) => ({
      where: { name },
      create: { name }
    }))

    // Update the listing
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        title,
        description,
        type,
        budget,
        requirements,
        perks,
        categories: {
          deleteMany: {},
          create: categoryConnectOrCreate.map((cat: CategoryConnectOrCreate) => ({
            category: {
              connectOrCreate: cat
            }
          }))
        }
      },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this listing' }, { status: 403 })
    }

    await prisma.listing.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
} 