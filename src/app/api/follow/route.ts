import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/follow { targetId }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { targetId } = await req.json();
  if (!targetId || targetId === session.user.id) {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
  }
  // Only allow following other creators
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target || target.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Target must be a creator' }, { status: 400 });
  }
  // Check if already following
  const existing = await prisma.follow.findFirst({
    where: { followerId: session.user.id, followingId: targetId },
  });
  if (existing) {
    return NextResponse.json({ success: true, alreadyFollowing: true });
  }
  await prisma.follow.create({
    data: {
      followerId: session.user.id,
      followingId: targetId,
    },
  });
  return NextResponse.json({ success: true });
}

// DELETE /api/follow { targetId }
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { targetId } = await req.json();
  if (!targetId || targetId === session.user.id) {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
  }
  await prisma.follow.deleteMany({
    where: { followerId: session.user.id, followingId: targetId },
  });
  return NextResponse.json({ success: true });
}

// GET /api/follow?targetId=xxx
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get('targetId');
  if (!targetId || targetId === session.user.id) {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
  }
  const following = await prisma.follow.findFirst({
    where: { followerId: session.user.id, followingId: targetId },
  });
  return NextResponse.json({ following: !!following });
} 