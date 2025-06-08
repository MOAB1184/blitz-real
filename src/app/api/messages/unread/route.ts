export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

interface Participant {
  id: string;
  name: string | null;
  image: string | null;
}

interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  participants: {
    user: Participant;
  }[];
  messages: {
    id: string;
    content: string;
    createdAt: Date;
    senderId: string;
  }[];
}

interface UserParticipation {
  id: string;
  userId: string;
  conversationId: string;
  hasUnread: boolean;
  createdAt: Date;
  updatedAt: Date;
  conversation: Conversation;
}

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
    const formattedUnreadConversations = unreadConversations.map((participation: UserParticipation) => {
      const conversation = participation.conversation;
      const lastMessage = conversation.messages[0];
      const otherParticipants = conversation.participants.filter(
        (p: { user: Participant }) => p.user.id !== userId
      );

      return {
        id: conversation.id,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId
        } : null,
        participants: otherParticipants.map((p: { user: Participant }) => p.user),
        updatedAt: conversation.updatedAt
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

