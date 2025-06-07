import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get active applications count
    const activeApplications = await prisma.application.count({
      where: {
        userId: session.user.id,
        status: 'PENDING'
      }
    })

    // Get sponsor matches count (sponsors that match creator's profile)
    const sponsorMatches = await prisma.user.count({
      where: {
        role: 'SPONSOR',
        // Add any additional matching criteria here
      }
    })

    // Get unread messages count
    const messages = await prisma.message.count({
      where: {
        receiverId: session.user.id,
        read: false
      }
    })

    // Get profile views count
    const profileViews = await prisma.profileView.count({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json({
      activeApplications,
      sponsorMatches,
      messages,
      profileViews
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
} 