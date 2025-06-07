import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/payments/[paymentId]
// Get payment details
export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId } = params;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
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
            description: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify the user is either the sender or receiver
    if (payment.senderId !== session.user.id && payment.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to view this payment' },
        { status: 403 }
      );
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}

// PATCH /api/payments/[paymentId]
// Update payment status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId } = params;
    const { status } = await req.json();

    // Validate status
    if (!['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // In a real app, you would have more complex authorization logic
    // For now, we'll allow the sender to update the payment status
    if (payment.senderId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this payment' },
        { status: 403 }
      );
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
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
      },
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}

// DELETE /api/payments/[paymentId]
// Cancel a pending payment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId } = params;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Only allow cancellation of pending payments by the sender
    if (payment.senderId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to cancel this payment' },
        { status: 403 }
      );
    }

    if (payment.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending payments can be cancelled' },
        { status: 400 }
      );
    }

    // In a real app, you would also cancel the Stripe payment intent if it exists
    // await stripe.paymentIntents.cancel(payment.stripePaymentIntentId);

    // Delete the payment record
    await prisma.payment.delete({
      where: { id: paymentId },
    });

    return NextResponse.json({ message: 'Payment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel payment' },
      { status: 500 }
    );
  }
}

