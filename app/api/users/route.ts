import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Define user roles enum for type safety
enum UserRole {
  ADMIN = 'admin',
  INVESTOR = 'investor',
  ENTREPRENEUR = 'entrepreneur'
}

// GET handler to fetch all users
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    
    // Build the query
    const query: any = {};
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      query.role = role;
    }
    
    // Fetch users from the database
    const users = await db.collection('users')
      .find(query)
      .project({ password: 0 }) // Exclude password for security
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST handler to create a new user
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Get request body
    const body = await request.json();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Add timestamps
    const newUser = {
      ...body,
      email: body.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create a new user
    const result = await db.collection('users').insertOne(newUser);
    
    // Fetch the created user
    const insertedUser = await db.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );
    
    return NextResponse.json({ success: true, data: insertedUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
} 