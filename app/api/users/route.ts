import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User, { UserRole } from '@/lib/models/User';

// GET handler to fetch all users
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role') as UserRole | null;
    
    // Build the query
    const query = role ? { role } : {};
    
    // Fetch users from the database
    const users = await User.find(query)
      .select('-password') // Exclude password for security
      .sort({ createdAt: -1 })
      .limit(100);
    
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
    await connectToDatabase();
    
    // Get request body
    const body = await request.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create a new user
    const newUser = await User.create(body);
    
    // Return the new user without the password
    const user = newUser.toObject();
    delete user.password;
    
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
} 