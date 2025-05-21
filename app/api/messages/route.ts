import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Message from '@/lib/models/Message';
import User from '@/lib/models/User';

// GET handler to fetch messages (conversation between users)
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const sender = searchParams.get('sender');
    const receiver = searchParams.get('receiver');
    const pitch = searchParams.get('pitch');
    
    // Validate required params
    if (!sender || !receiver) {
      return NextResponse.json(
        { success: false, error: 'Sender and receiver IDs are required' },
        { status: 400 }
      );
    }
    
    // Build the query for a conversation between two users
    const query: any = {
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }, // Get messages from both directions
      ],
    };
    
    // If pitch is specified, filter by pitch
    if (pitch) {
      query.relatedPitch = pitch;
    }
    
    // Fetch messages from the database
    const messages = await Message.find(query)
      .populate('sender', 'name email profilePicture')
      .populate('receiver', 'name email profilePicture')
      .sort({ createdAt: 1 }) // Sort by creation date ascending
      .limit(100);
    
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST handler to create a new message
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.sender || !body.receiver || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Sender, receiver, and content are required' },
        { status: 400 }
      );
    }
    
    // Validate that sender and receiver exist
    const [senderExists, receiverExists] = await Promise.all([
      User.exists({ _id: body.sender }),
      User.exists({ _id: body.receiver })
    ]);
    
    if (!senderExists || !receiverExists) {
      return NextResponse.json(
        { success: false, error: 'Sender or receiver not found' },
        { status: 404 }
      );
    }
    
    // Create a new message
    const newMessage = await Message.create(body);
    
    // Populate sender and receiver info
    await newMessage.populate([
      { path: 'sender', select: 'name email profilePicture' },
      { path: 'receiver', select: 'name email profilePicture' }
    ]);
    
    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ success: false, error: 'Failed to create message' }, { status: 500 });
  }
} 