import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/messages/unread
// Get count of unread messages for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Count unread messages
    const unreadCount = await prisma.participant.count({
      where: {
        userId,
        hasUnread: true,
      },
    });

    // Get conversations with unread messages
    const unreadConversations = await prisma.participant.findMany({
      where: {
        userId,
        hasUnread: true,
      },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
            messages: {
              where: {
                receiverId: userId,
                read: false,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 5,
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Format the unread conversations for the client
    const formattedUnreadConversations = unreadConversations.map((participation) => {
      const otherParticipants = participation.conversation.participants.filter(
        (p) => p.userId !== userId
      );

      return {
        id: participation.conversation.id,
        participants: otherParticipants.map((p) => p.user),
        unreadMessages: participation.conversation.messages,
      };
    });

    return NextResponse.json({
      unreadCount,
      unreadConversations: formattedUnreadConversations,
    });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread messages' },
      { status: 500 }
    );
  }
}

