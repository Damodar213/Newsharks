import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    try {
      await connectToDatabase();
      console.log('Connected to database');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection error' },
        { status: 500 }
      );
    }
    
    // Check what models are available in mongoose
    console.log('Available models:', Object.keys(mongoose.models));
    
    console.log('Finding user...');
    let user;
    try {
      user = await User.findOne({ email });
      console.log('User found:', user ? 'Yes' : 'No');
    } catch (findError) {
      console.error('Error finding user:', findError);
      return NextResponse.json(
        { success: false, error: 'Error finding user' },
        { status: 500 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('User schema methods:', Object.keys(User.schema?.methods || {}));
    console.log('User instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(user)));

    console.log('Comparing passwords...');
    let isPasswordValid = false;
    
    try {
      // Try using the comparePassword method if it exists
      if (typeof user.comparePassword === 'function') {
        isPasswordValid = await user.comparePassword(password);
        console.log('Password valid (using comparePassword):', isPasswordValid);
      } 
      // Fallback to direct bcrypt comparison if method isn't available
      else {
        console.log('comparePassword method not found, using direct bcrypt comparison');
        isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid (using bcrypt directly):', isPasswordValid);
      }
    } catch (compareError) {
      console.error('Error during password comparison:', compareError);
      return NextResponse.json(
        { success: false, error: 'Authentication system error' },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
      location: user.location,
      website: user.website,
      socialLinks: user.socialLinks,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred during login',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 