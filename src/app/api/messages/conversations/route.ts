import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface Participant {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  userId: string;
  hasUnread: boolean;
}

interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  participants: Participant[];
  messages: {
    id: string;
    content: string;
    createdAt: Date;
    sender: {
      name: string | null;
    };
  }[];
}

interface UserParticipation {
  id: string;
  userId: string;
  conversationId: string;
  hasUnread: boolean;
  conversation: Conversation;
}

// GET /api/messages/conversations
// Get all conversations for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all conversations where the user is a participant
    const userParticipations = await prisma.participant.findMany({
      where: {
        userId: userId,
      },
      include: {
        conversation: {
          include: {
            participants: true,
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
              include: {
                sender: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        conversation: {
          updatedAt: 'desc',
        },
      },
    });

    // Format the conversations for the client
    const conversations = userParticipations.map((participation: UserParticipation) => {
      const otherParticipants = participation.conversation.participants.filter(
        (p: Participant) => p.userId !== userId
      );

      return {
        id: participation.conversation.id,
        lastMessage: participation.conversation.messages[0] ? {
          content: participation.conversation.messages[0].content,
          sender: participation.conversation.messages[0].sender.name,
          timestamp: participation.conversation.messages[0].createdAt
        } : null,
        participants: otherParticipants.map((p: Participant) => ({
          id: p.userId,
          hasUnread: p.hasUnread
        })),
        updatedAt: participation.conversation.updatedAt
      };
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
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

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'Participant IDs are required' },
        { status: 400 }
      );
    }

    // Make sure the current user is included in the participants
    const allParticipantIds = [...new Set([session.user.id, ...participantIds])];

    // Check if a conversation already exists with these exact participants
    const existingConversations = await prisma.conversation.findMany({
      include: {
        participants: true,
      },
    });

    const existingConversation = existingConversations.find((conversation) => {
      const participantIds = conversation.participants.map((p) => p.userId);
      return (
        participantIds.length === allParticipantIds.length &&
        allParticipantIds.every((id) => participantIds.includes(id))
      );
    });

    if (existingConversation) {
      return NextResponse.json({
        id: existingConversation.id,
        message: 'Conversation already exists',
      });
    }

    // Create a new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: allParticipantIds.map((userId) => ({
            userId,
          })),
        },
      },
    });

    return NextResponse.json({
      id: conversation.id,
      message: 'Conversation created successfully',
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}


