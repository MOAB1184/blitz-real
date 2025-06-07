import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface Application {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  listing: {
    title: string;
  };
}

interface Message {
  id: string;
  sender: {
    name: string | null;
  };
  content: string;
  createdAt: Date;
  conversationId: string;
}

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
        listing: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
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
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Combine and sort activities
    const activities = [
      ...recentApplications.map((app: Application) => ({
        id: app.id,
        type: 'application',
        status: app.status,
        title: app.listing.title,
        timestamp: app.updatedAt
      })),
      ...recentMessages.map((msg: Message) => ({
        id: msg.id,
        type: 'message',
        sender: msg.sender.name || 'Unknown',
        content: msg.content,
        timestamp: msg.createdAt
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json({ error: 'Failed to fetch recent activity' }, { status: 500 })
  }
} 