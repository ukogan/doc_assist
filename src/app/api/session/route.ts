import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  createSession,
  getSession,
  setPreferences,
} from '@/app/lib/storage/redis-client';
import { UserPreferences } from '@/app/lib/types';

// Create a new session
export async function POST() {
  try {
    const sessionId = uuidv4();
    const session = await createSession(sessionId);

    // Create default preferences
    const preferences: UserPreferences = {
      sessionId,
      fontSize: 'normal',
      highContrast: false,
      preferredComplexity: 'standard',
      updatedAt: new Date().toISOString(),
    };
    await setPreferences(preferences);

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      session,
    });

    // Set session cookie (30 days)
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// Validate existing session
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ valid: false, reason: 'No session cookie' });
    }

    const session = await getSession(sessionId);

    if (!session) {
      return NextResponse.json({ valid: false, reason: 'Session not found' });
    }

    return NextResponse.json({
      valid: true,
      session,
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate session' },
      { status: 500 }
    );
  }
}
