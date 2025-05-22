import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Conversation } from '@/models/Conversation';

// POST - Create or find a conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participants, project } = body;

    if (!participants || !Array.isArray(participants) || participants.length !== 2 || !project) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid participants or project' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Try to find an existing conversation with the same participants and project
    const existing = await Conversation.findOne({
      participants: { $all: participants, $size: 2 },
      project,
    });

    if (existing) {
      return NextResponse.json({ success: true, conversation: existing });
    }

    // Create a new conversation
    const newConversation = new Conversation({
      participants,
      project,
    });
    await newConversation.save();

    return NextResponse.json({ success: true, conversation: newConversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
