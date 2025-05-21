import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Offer, { OfferStatus } from '@/lib/models/Offer';
import User, { UserRole } from '@/lib/models/User';
import Pitch from '@/lib/models/Pitch';

// GET handler to fetch all offers
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const investor = searchParams.get('investor');
    const pitch = searchParams.get('pitch');
    const status = searchParams.get('status') as OfferStatus | null;
    
    // Build the query
    const query: any = {};
    if (investor) query.investor = investor;
    if (pitch) query.pitch = pitch;
    if (status) query.status = status;
    
    // Fetch offers from the database
    const offers = await Offer.find(query)
      .populate('investor', 'name email profilePicture')
      .populate({
        path: 'pitch',
        populate: {
          path: 'entrepreneur',
          select: 'name email profilePicture'
        }
      })
      .sort({ createdAt: -1 })
      .limit(100);
    
    return NextResponse.json({ success: true, data: offers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch offers' }, { status: 500 });
  }
}

// POST handler to create a new offer
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.investor || !body.pitch || !body.amount || !body.equity) {
      return NextResponse.json(
        { success: false, error: 'Investor, pitch, amount, and equity are required' },
        { status: 400 }
      );
    }
    
    // Validate that investor exists and is an investor
    const investor = await User.findById(body.investor);
    if (!investor) {
      return NextResponse.json(
        { success: false, error: 'Investor not found' },
        { status: 404 }
      );
    }
    
    if (investor.role !== UserRole.INVESTOR) {
      return NextResponse.json(
        { success: false, error: 'Only investors can create offers' },
        { status: 403 }
      );
    }
    
    // Validate that pitch exists
    const pitch = await Pitch.findById(body.pitch);
    if (!pitch) {
      return NextResponse.json(
        { success: false, error: 'Pitch not found' },
        { status: 404 }
      );
    }
    
    // Set expiration date if not provided (default to 7 days from now)
    if (!body.expiresAt) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      body.expiresAt = expirationDate;
    }
    
    // Create a new offer
    const newOffer = await Offer.create(body);
    
    // Populate investor and pitch info
    await newOffer.populate([
      { path: 'investor', select: 'name email profilePicture' },
      {
        path: 'pitch',
        populate: {
          path: 'entrepreneur',
          select: 'name email profilePicture'
        }
      }
    ]);
    
    return NextResponse.json({ success: true, data: newOffer }, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ success: false, error: 'Failed to create offer' }, { status: 500 });
  }
} 