import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface SocialLinks {
  budgetRange?: string;
  preferredPlatforms?: string;
  niche?: string;
  platforms?: string;
  [key: string]: any;
}

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
  
  let budgetRange = undefined, preferredPlatforms = undefined, niche = undefined, platforms = undefined;
  let socialLinksObj: SocialLinks = {};
  
  if (user?.socialLinks) {
    if (typeof user.socialLinks === 'string') {
      try { socialLinksObj = JSON.parse(user.socialLinks); } catch { socialLinksObj = {}; }
    } else {
      socialLinksObj = user.socialLinks as SocialLinks;
    }
    budgetRange = socialLinksObj.budgetRange;
    preferredPlatforms = socialLinksObj.preferredPlatforms;
    niche = socialLinksObj.niche;
    platforms = socialLinksObj.platforms;
  }
  
  return NextResponse.json({ 
    ...user, 
    budgetRange, 
    preferredPlatforms,
    niche,
    platforms
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const data = await req.json();
  
  // Get existing socialLinks
  const existingUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { socialLinks: true }
  });
  
  let existingSocialLinks: SocialLinks = {};
  if (existingUser?.socialLinks) {
    if (typeof existingUser.socialLinks === 'string') {
      try { existingSocialLinks = JSON.parse(existingUser.socialLinks); } catch { existingSocialLinks = {}; }
    } else {
      existingSocialLinks = existingUser.socialLinks as SocialLinks;
    }
  }
  
  // Merge new data with existing socialLinks
  let socialLinks: SocialLinks = { ...existingSocialLinks };
  if (data.budgetRange) socialLinks.budgetRange = data.budgetRange;
  if (data.preferredPlatforms) socialLinks.preferredPlatforms = data.preferredPlatforms;
  if (data.niche) socialLinks.niche = data.niche;
  if (data.platforms) socialLinks.platforms = data.platforms;
  
  // If socialLinks is passed directly, merge it
  if (data.socialLinks) {
    socialLinks = { ...socialLinks, ...data.socialLinks };
  }
  
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
  
  let budgetRange = undefined, preferredPlatforms = undefined, niche = undefined, platforms = undefined;
  let socialLinksObj: SocialLinks = {};
  
  if (user?.socialLinks) {
    if (typeof user.socialLinks === 'string') {
      try { socialLinksObj = JSON.parse(user.socialLinks); } catch { socialLinksObj = {}; }
    } else {
      socialLinksObj = user.socialLinks as SocialLinks;
    }
    budgetRange = socialLinksObj.budgetRange;
    preferredPlatforms = socialLinksObj.preferredPlatforms;
    niche = socialLinksObj.niche;
    platforms = socialLinksObj.platforms;
  }
  
  return NextResponse.json({ 
    ...user, 
    budgetRange, 
    preferredPlatforms,
    niche,
    platforms
  });
} 