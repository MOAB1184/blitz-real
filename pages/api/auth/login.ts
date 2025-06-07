import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

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

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return res.redirect(302, '/login?error=1');
  }
  if (!user.isVerified) {
    return res.redirect(302, '/login?error=1');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.redirect(302, '/login?error=1');
  }

  const token = generateToken({ userId: user._id });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return res.redirect(302, '/dashboard');
} 