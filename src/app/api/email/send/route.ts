import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to, subject, text, html } = await req.json();
  if (!to || !subject || (!text && !html)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL || session.user.email,
      subject,
      text,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SendGrid error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 