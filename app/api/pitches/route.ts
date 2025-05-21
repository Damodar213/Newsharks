import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Pitch from '@/lib/models/Pitch';
import User, { UserRole } from '@/lib/models/User';

// GET handler to fetch all pitches
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const entrepreneur = searchParams.get('entrepreneur');
    const industry = searchParams.get('industry');
    
    // Build the query
    const query: any = {};
    if (status) query.status = status;
    if (entrepreneur) query.entrepreneur = entrepreneur;
    if (industry) query.industry = industry;
    
    // Fetch pitches from the database
    const pitches = await Pitch.find(query)
      .populate('entrepreneur', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .limit(100);
    
    return NextResponse.json({ success: true, data: pitches }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pitches:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch pitches' }, { status: 500 });
  }
}

// POST handler to create a new pitch
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get request body
    const body = await request.json();
    
    // Validate that the entrepreneur exists and is an entrepreneur
    const entrepreneur = await User.findById(body.entrepreneur);
    if (!entrepreneur) {
      return NextResponse.json(
        { success: false, error: 'Entrepreneur not found' },
        { status: 404 }
      );
    }
    
    if (entrepreneur.role !== UserRole.ENTREPRENEUR) {
      return NextResponse.json(
        { success: false, error: 'Only entrepreneurs can create pitches' },
        { status: 403 }
      );
    }
    
    // Create a new pitch
    const newPitch = await Pitch.create(body);
    
    // Populate entrepreneur info
    await newPitch.populate('entrepreneur', 'name email profilePicture');
    
    return NextResponse.json({ success: true, data: newPitch }, { status: 201 });
  } catch (error) {
    console.error('Error creating pitch:', error);
    return NextResponse.json({ success: false, error: 'Failed to create pitch' }, { status: 500 });
  }
} 