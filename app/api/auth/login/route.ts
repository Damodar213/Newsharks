import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get login credentials from request body
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Remove password from user object before sending response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    // Return user data
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: userResponse
    }, { status: 200 });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'An error occurred during login' 
    }, { status: 500 });
  }
} 