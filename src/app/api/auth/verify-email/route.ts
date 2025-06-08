import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find unverified user with valid token
    const unverifiedUser = await prisma.unverifiedUser.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!unverifiedUser) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Create verified user
    const verifiedUser = await prisma.user.create({
      data: {
        email: unverifiedUser.email,
        password: unverifiedUser.password,
        name: unverifiedUser.name,
        role: unverifiedUser.role as any,
        isVerified: true
      }
    });

    // Delete unverified user
    await prisma.unverifiedUser.delete({
      where: { id: unverifiedUser.id }
    });

    return NextResponse.json({
      message: 'Email verified successfully',
      user: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        name: verifiedUser.name,
        role: verifiedUser.role
      }
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
} 