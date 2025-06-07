import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const listingId = searchParams.get('listingId')

  if (!listingId) {
    return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
  }

  try {
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        listingId: listingId
      }
    })

    return NextResponse.json({ hasApplied: !!existingApplication })
  } catch (error) {
    console.error('Error checking application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 