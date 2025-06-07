import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ObjectId } from 'bson'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const listingId = params.id
  const userId = session.user.id

  // Ensure both are valid ObjectId strings
  if (!ObjectId.isValid(listingId) || !ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  // Prevent duplicate applications
  const existing = await prisma.application.findFirst({
    where: { userId: userId, listingId: listingId }
  })
  if (existing) {
    return NextResponse.json({ error: 'Already applied' }, { status: 400 })
  }

  const application = await prisma.application.create({
    data: {
      userId: userId,
      listingId: listingId,
      proposal: '', // You can extend to accept a proposal in the future
      status: 'PENDING',
    }
  })
  return NextResponse.json(application)
} 