import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      website: true,
      socialLinks: true,
      role: true,
    },
  });
  let budgetRange = undefined, preferredPlatforms = undefined;
  let socialLinksObj = undefined;
  if (user?.socialLinks) {
    if (typeof user.socialLinks === 'string') {
      try { socialLinksObj = JSON.parse(user.socialLinks); } catch { socialLinksObj = {}; }
    } else {
      socialLinksObj = user.socialLinks;
    }
    budgetRange = socialLinksObj.budgetRange;
    preferredPlatforms = socialLinksObj.preferredPlatforms;
  }
  return NextResponse.json({ ...user, budgetRange, preferredPlatforms });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  // Merge budgetRange and preferredPlatforms into socialLinks
  let socialLinks = data.socialLinks || {};
  if (data.budgetRange) socialLinks.budgetRange = data.budgetRange;
  if (data.preferredPlatforms) socialLinks.preferredPlatforms = data.preferredPlatforms;
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      image: data.image,
      bio: data.bio,
      website: data.website,
      socialLinks,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      website: true,
      socialLinks: true,
      role: true,
    },
  });
  let budgetRange = undefined, preferredPlatforms = undefined;
  let socialLinksObj = undefined;
  if (user?.socialLinks) {
    if (typeof user.socialLinks === 'string') {
      try { socialLinksObj = JSON.parse(user.socialLinks); } catch { socialLinksObj = {}; }
    } else {
      socialLinksObj = user.socialLinks;
    }
    budgetRange = socialLinksObj.budgetRange;
    preferredPlatforms = socialLinksObj.preferredPlatforms;
  }
  return NextResponse.json({ ...user, budgetRange, preferredPlatforms });
} 