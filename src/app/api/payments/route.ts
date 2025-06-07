import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/payments
// Get user's payment history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'sent' or 'received'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    if (type === 'sent') {
      whereClause.senderId = session.user.id;
    } else if (type === 'received') {
      whereClause.receiverId = session.user.id;
    } else {
      // Get both sent and received payments
      whereClause = {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      };
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const totalCount = await prisma.payment.count({
      where: whereClause,
    });

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST /api/payments
// Create a new payment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, amount, listingId, description } = await req.json();

    // Validate input
    if (!receiverId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Receiver ID and valid amount are required' },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      );
    }

    // Calculate fees
    const platformFeeRate = 0.02; // 2% platform fee
    const processingFeeRate = 0.03; // 3% processing fee
    
    const platformFee = amount * platformFeeRate;
    const processingFee = amount * processingFeeRate;
    const total = amount + platformFee + processingFee;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        platformFee,
        processingFee,
        total,
        senderId: session.user.id,
        receiverId,
        listingId: listingId || undefined,
        description: description || undefined,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

