export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Send a message
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { receiverId, content } = await req.json();

    // Find or create a conversation between the users
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: {
            AND: [
              { userId: session.user.id },
              { userId: receiverId }
            ]
          }
        }
      }
    });

    if (!conversation) {
      // Create a new conversation if one doesn't exist
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              { userId: session.user.id },
              { userId: receiverId }
            ]
          }
        }
      });
    }

    // Create the message with the conversation ID
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
        conversationId: conversation.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Update the conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error('Message creation error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// Fetch messages between two users
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
} 