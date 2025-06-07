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

interface ConversationWithParticipants {
  id: string;
  participants: {
    userId: string;
  }[];
}

// GET /api/messages/conversations
// Get all conversations for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all conversations where the user is a participant
    const userParticipations = await prisma.participant.findMany({
      where: { userId: session.user.id },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true
                  }
                }
              }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                content: true,
                createdAt: true,
                senderId: true
              }
            }
          }
        }
      },
      orderBy: {
        conversation: {
          updatedAt: 'desc'
        }
      }
    });

    // Format the conversations
    const conversations = userParticipations.map((participation: UserParticipation) => {
      const conversation = participation.conversation;
      const lastMessage = conversation.messages[0];
      const otherParticipants = conversation.participants
        .filter((p: { user: Participant }) => p.user.id !== session.user.id)
        .map((p: { user: Participant }) => p.user);

      return {
        id: conversation.id,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId
        } : null,
        participants: otherParticipants,
        updatedAt: conversation.updatedAt,
        hasUnread: participation.hasUnread
      };
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST /api/messages/conversations
// Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { participantIds } = await req.json();

    if (!Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json({ error: 'Invalid participant IDs' }, { status: 400 });
    }

    // Make sure the current user is included in the participants
    const allParticipantIds = Array.from(new Set([session.user.id, ...participantIds]));

    // Check if a conversation already exists with these exact participants
    const existingConversations = await prisma.conversation.findMany({
      where: {
        participants: {
          every: {
            userId: {
              in: allParticipantIds
            }
          }
        }
      },
      include: {
        participants: true
      }
    });

    // Find a conversation that has exactly these participants
    const existingConversation = existingConversations.find((conversation: ConversationWithParticipants) => {
      const conversationParticipantIds = conversation.participants.map(p => p.userId);
      return (
        conversationParticipantIds.length === allParticipantIds.length &&
        allParticipantIds.every(id => conversationParticipantIds.includes(id))
      );
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Create a new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          create: allParticipantIds.map(userId => ({
            userId,
            hasUnread: userId !== session.user.id
          }))
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}


