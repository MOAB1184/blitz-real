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
    // Get recent applications
    const recentApplications = await prisma.application.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        listing: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Get recent messages
    const recentMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Combine and format activities
    const activities = [
      ...recentApplications.map(app => ({
        id: app.id,
        type: 'application_update',
        title: `Application ${app.status.toLowerCase()}`,
        description: `Your application for "${app.listing.title}" has been ${app.status.toLowerCase()}.`,
        time: app.updatedAt,
        link: '/dashboard/applications'
      })),
      ...recentMessages.map(msg => ({
        id: msg.id,
        type: 'message',
        title: `Message from ${msg.sender.name}`,
        description: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : ''),
        time: msg.createdAt,
        link: `/dashboard/messages?conversation=${msg.conversationId}`
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5)

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json({ error: 'Failed to fetch recent activity' }, { status: 500 })
  }
} 