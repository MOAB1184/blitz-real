import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/notifications
// Get current user's notification preferences
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, we'll return default notification preferences
    // In a real app, you'd store these in the database
    const defaultPreferences = {
      emailNotifications: {
        newMessages: true,
        applicationUpdates: true,
        listingMatches: true,
        paymentUpdates: true,
        weeklyDigest: false,
      },
      pushNotifications: {
        newMessages: true,
        applicationUpdates: true,
        listingMatches: false,
        paymentUpdates: true,
      },
      smsNotifications: {
        paymentUpdates: false,
        urgentUpdates: false,
      },
    };

    return NextResponse.json(defaultPreferences);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications
// Update current user's notification preferences
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await req.json();

    // Validate the preferences structure
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { error: 'Invalid preferences format' },
        { status: 400 }
      );
    }

    // In a real app, you'd save these to the database
    // For now, we'll just return the updated preferences
    console.log('Updated notification preferences for user:', session.user.id, preferences);

    return NextResponse.json({
      message: 'Notification preferences updated successfully',
      preferences,
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}

