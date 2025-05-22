import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Message } from '@/models/Message';
import { Conversation } from '@/models/Conversation';
import User from '@/lib/models/User';

// GET - Fetch messages for a conversation or by receiver
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const receiverId = searchParams.get('receiverId');
    
    await connectToDatabase();

    if (receiverId) {
      // Fetch all messages where receiver is receiverId
      const messages = await Message.find({ receiver: receiverId })
        .populate('sender', 'name role')
        .populate('receiver', 'name role')
        .populate('project', 'title')
        .sort({ createdAt: -1 });
      return NextResponse.json({
        success: true,
        messages: messages
      });
    }

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID or receiverId is required' },
        { status: 400 }
      );
    }
    
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 });
    
    return NextResponse.json({
      success: true,
      messages: messages
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
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, content, sender, receiver, project } = body;
    
    if (!conversationId || !content || !sender || !receiver || !project) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Create new message
    const newMessage = new Message({
      conversation: conversationId,
      content,
      sender,
      receiver,
      project,
      read: false
    });
    
    await newMessage.save();
    
    // Update conversation's last message and unread count
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      $inc: { unreadCount: 1 }
    });
    
    // Populate sender and receiver details
    await newMessage.populate('sender', 'name role');
    await newMessage.populate('receiver', 'name role');
    
    return NextResponse.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 