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

interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: Date;
  sender: {
    name: string | null;
  };
}

// GET /api/messages/[conversationId]
// Get all messages for a specific conversation
export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = params;
    const userId = session.user.id;

    // Check if the user is a participant in this conversation
    const participant = await prisma.participant.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'You are not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Get all messages for this conversation
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Mark all unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    // Update participant's unread status
    await prisma.participant.update({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
      data: {
        hasUnread: false,
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages/[conversationId]
// Send a new message in a conversation
export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = params;
    const { content } = await req.json();
    const senderId = session.user.id;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Check if the user is a participant in this conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const isParticipant = conversation.participants.some(
      (p: Participant) => p.userId === senderId
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You are not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Get the other participants
    const otherParticipants = conversation.participants.filter(
      (p: Participant) => p.userId !== senderId
    );

    if (otherParticipants.length === 0) {
      return NextResponse.json(
        { error: 'No other participants in this conversation' },
        { status: 400 }
      );
    }

    // Create a new message for each recipient
    const messages = [];
    for (const participant of otherParticipants) {
      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId: participant.userId,
          conversationId,
        },
      });
      messages.push(message);

      // Mark the participant as having unread messages
      await prisma.participant.update({
        where: {
          userId_conversationId: {
            userId: participant.userId,
            conversationId,
          },
        },
        data: {
          hasUnread: true,
        },
      });
    }

    // Update the conversation's lastMessageAt
    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Message sent successfully',
      messages,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

