import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User, { UserRole } from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log("Registration API called");
  
  try {
    // Connect to the database
    const db = await connectToDatabase();
    console.log("Database connected successfully");
    
    // Get registration data from request body
    const body = await request.json();
    console.log("Registration body received");
    
    const { name, email, password, role } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      console.log("Missing required fields");
      return NextResponse.json({ 
        success: false, 
        error: 'Name, email, and password are required' 
      }, { status: 400 });
    }
    
    // Use a valid role or default to entrepreneur
    const userRole = role === "investor" ? UserRole.INVESTOR : 
                     role === "admin" ? UserRole.ADMIN : 
                     UserRole.ENTREPRENEUR;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      bio: '',
      profilePicture: '',
    });
    
    await newUser.save();
    console.log("User created successfully:", newUser._id);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error details:', error);
    
    // Check for specific MongoDB errors
    const err = error as any;
    
    // Duplicate key error (email already exists)
    if (err.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email is already registered'
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Registration failed',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
} 