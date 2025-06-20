import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      listing: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(applications)
} 