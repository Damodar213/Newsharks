import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch messages for a conversation or by receiver
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const receiverId = searchParams.get('receiverId');
    
    const { db } = await connectToDatabase();

    if (receiverId) {
      // Create ObjectId for the receiver
      let receiverObjectId;
      try {
        receiverObjectId = new ObjectId(receiverId);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid receiver ID format' },
          { status: 400 }
        );
      }
      
      // Fetch all messages where receiver is receiverId
      const messages = await db.collection('messages')
        .find({ receiver: receiverObjectId })
        .sort({ createdAt: -1 })
        .toArray();
      
      // Populate sender, receiver, and project information
      const populatedMessages = await Promise.all(
        messages.map(async (message) => {
          // Get sender info
          const sender = await db.collection('users').findOne(
            { _id: message.sender },
            { projection: { name: 1, role: 1 } }
          );
          
          // Get receiver info
          const receiver = await db.collection('users').findOne(
            { _id: message.receiver },
            { projection: { name: 1, role: 1 } }
          );
          
          // Get project info if available
          let project = null;
          if (message.project) {
            project = await db.collection('projects').findOne(
              { _id: message.project },
              { projection: { title: 1 } }
            );
          }
          
          return {
            ...message,
            sender: sender || { name: 'Unknown', role: 'unknown' },
            receiver: receiver || { name: 'Unknown', role: 'unknown' },
            project: project || { title: 'Unknown Project' }
          };
        })
      );
      
      return NextResponse.json({
        success: true,
        messages: populatedMessages
      });
    }

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID or receiverId is required' },
        { status: 400 }
      );
    }
    
    // Create ObjectId for the conversation
    let conversationObjectId;
    try {
      conversationObjectId = new ObjectId(conversationId);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid conversation ID format' },
        { status: 400 }
      );
    }
    
    // Fetch messages
    const messages = await db.collection('messages')
      .find({ conversation: conversationObjectId })
      .sort({ createdAt: 1 })
      .toArray();
    
    // Populate sender and receiver information
    const populatedMessages = await Promise.all(
      messages.map(async (message) => {
        // Get sender info
        const sender = await db.collection('users').findOne(
          { _id: message.sender },
          { projection: { name: 1, role: 1 } }
        );
        
        // Get receiver info
        const receiver = await db.collection('users').findOne(
          { _id: message.receiver },
          { projection: { name: 1, role: 1 } }
        );
        
        return {
          ...message,
          sender: sender || { name: 'Unknown', role: 'unknown' },
          receiver: receiver || { name: 'Unknown', role: 'unknown' }
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      messages: populatedMessages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, content, sender, receiver, project } = body;
    
    if (!conversationId || !content || !sender || !receiver || !project) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Convert string IDs to ObjectIds
    let conversationObjectId, senderObjectId, receiverObjectId, projectObjectId;
    
    try {
      conversationObjectId = new ObjectId(conversationId);
      senderObjectId = new ObjectId(sender);
      receiverObjectId = new ObjectId(receiver);
      projectObjectId = new ObjectId(project);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format in request' },
        { status: 400 }
      );
    }
    
    // Create new message
    const newMessage = {
      conversation: conversationObjectId,
      content,
      sender: senderObjectId,
      receiver: receiverObjectId,
      project: projectObjectId,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    // Insert message into database
    const result = await db.collection('messages').insertOne(newMessage);
    
    if (!result.insertedId) {
      return NextResponse.json(
        { success: false, error: 'Failed to insert message' },
        { status: 500 }
      );
    }
    
    // Update conversation's last message and unread count
    await db.collection('conversations').updateOne(
      { _id: conversationObjectId },
      {
        $set: { lastMessage: result.insertedId },
        $inc: { unreadCount: 1 },
        $currentDate: { updatedAt: true }
      }
    );
    
    // Get the created message with populated sender and receiver
    const messageWithId = { ...newMessage, _id: result.insertedId };
    
    // Get sender info
    const senderInfo = await db.collection('users').findOne(
      { _id: senderObjectId },
      { projection: { name: 1, role: 1 } }
    );
    
    // Get receiver info
    const receiverInfo = await db.collection('users').findOne(
      { _id: receiverObjectId },
      { projection: { name: 1, role: 1 } }
    );
    
    const populatedMessage = {
      ...messageWithId,
      sender: senderInfo || { name: 'Unknown', role: 'unknown' },
      receiver: receiverInfo || { name: 'Unknown', role: 'unknown' }
    };
    
    return NextResponse.json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 