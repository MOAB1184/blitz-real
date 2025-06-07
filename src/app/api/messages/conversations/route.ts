import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                  },
                },
              },
            },
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        conversation: {
          lastMessageAt: 'desc',
        },
      },
    });

    // Format the conversations for the client
    const conversations = userParticipations.map((participation) => {
      const otherParticipants = participation.conversation.participants.filter(
        (p) => p.userId !== userId
      );

      const lastMessage = participation.conversation.messages[0] || null;

      return {
        id: participation.conversation.id,
        participants: otherParticipants.map((p) => p.user),
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderId: lastMessage.senderId,
            }
          : null,
        hasUnread: participation.hasUnread,
        updatedAt: participation.conversation.updatedAt,
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

