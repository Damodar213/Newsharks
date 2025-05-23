import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would check a JWT token from cookies or headers
    // Since we're using localStorage for auth, we'll return a generic response
    // The actual user data is managed client-side via localStorage
    
    return NextResponse.json({
      success: false,
      message: 'No active session',
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred during auth check',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 