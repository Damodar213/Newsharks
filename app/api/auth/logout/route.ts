import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In a real app with sessions/cookies, you would invalidate the session here
    // Since we're using localStorage for auth, this is just a placeholder endpoint
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred during logout',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 