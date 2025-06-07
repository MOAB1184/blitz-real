import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  let email = '';
  let password = '';
  if (req.headers['content-type']?.includes('application/json')) {
    email = req.body.email;
    password = req.body.password;
  } else {
    // Handle form POST
    email = req.body.email;
    password = req.body.password;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.redirect(302, '/login?error=1');
    }

    if (!user.isVerified) {
      return res.redirect(302, '/login?error=1');
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.redirect(302, '/login?error=1');
    }

    const token = generateToken({ userId: user.id });
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    return res.redirect(302, '/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return res.redirect(302, '/login?error=1');
  } finally {
    await prisma.$disconnect();
  }
} 