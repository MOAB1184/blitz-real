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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            website: true,
            socialLinks: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
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
    return NextResponse.json({ error: 'Error fetching listing' }, { status: 500 })
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

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { categories: { include: { category: true } } }
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (listing.creatorId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const { categories, ...updateData } = data

  // Handle categories
  if (categories) {
    // Remove existing categories
    await prisma.categoriesOnListings.deleteMany({
      where: { listingId: params.id }
    })

    // Add new categories
    const validCategories = (categories || []).filter((name: string) => !!name && typeof name === 'string')
    const categoryConnectOrCreate = validCategories.map((name: string) => ({
      where: { name },
      create: { name }
    }))

    await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...updateData,
        categories: {
          create: categoryConnectOrCreate.map((cat: { where: { name: string }; create: { name: string } }) => ({
            category: { connectOrCreate: cat }
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
  } else {
    // Update without changing categories
    await prisma.listing.update({
      where: { id: params.id },
      data: updateData,
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    })
  }

  const updatedListing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  return NextResponse.json(updatedListing)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const listing = await prisma.listing.findUnique({
    where: { id: params.id }
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (listing.creatorId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.listing.delete({
    where: { id: params.id }
  })

  return NextResponse.json({ success: true })
} 