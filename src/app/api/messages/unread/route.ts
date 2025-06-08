import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const unreadCount = await prisma.message.count({
      where: {
        conversation: {
          participants: {
            some: {
              id: session.user.id
            }
          }
        },
        read: false,
        receiverId: session.user.id
      }
    })

    return NextResponse.json({ unreadCount })
  } catch (error) {
    console.error('Error fetching unread messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread messages' },
      { status: 500 }
    )
  }
}

