import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Convert userId to ObjectId
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Find all conversations where the user is a participant
    const conversations = await db.collection('conversations')
      .find({ participants: userObjectId })
      .sort({ updatedAt: -1 })
      .toArray();

    // Populate participants, project, and lastMessage information
    const populatedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // Get participants info
        const participantIds = conversation.participants || [];
        const participants = await Promise.all(
          participantIds.map(async (participantId) => {
            const user = await db.collection('users').findOne(
              { _id: participantId },
              { projection: { name: 1, role: 1 } }
            );
            return user || { _id: participantId, name: 'Unknown', role: 'unknown' };
          })
        );

        // Get project info
        let project = null;
        if (conversation.project) {
          project = await db.collection('projects').findOne(
            { _id: conversation.project },
            { projection: { title: 1 } }
          );
        }

        // Get lastMessage info
        let lastMessage = null;
        if (conversation.lastMessage) {
          lastMessage = await db.collection('messages').findOne(
            { _id: conversation.lastMessage }
          );
        }

        return {
          ...conversation,
          participants,
          project: project || { title: 'Unknown Project' },
          lastMessage
        };
      })
    );

    return NextResponse.json({
      success: true,
      conversations: populatedConversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch conversations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

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

    const { db } = await connectToDatabase();

    // Convert string IDs to ObjectIds
    let participantObjectIds: ObjectId[] = [];
    let projectObjectId: ObjectId;

    try {
      participantObjectIds = participants.map(id => new ObjectId(id));
      projectObjectId = new ObjectId(project);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid participant or project ID format' },
        { status: 400 }
      );
    }

    // Try to find an existing conversation with the same participants and project
    const existing = await db.collection('conversations').findOne({
      participants: { $all: participantObjectIds, $size: 2 },
      project: projectObjectId,
    });

    if (existing) {
      // Populate the existing conversation with participant and project info
      const populatedConversation = { ...existing };
      
      // Get participants info
      const participantsInfo = await Promise.all(
        existing.participants.map(async (participantId) => {
          const user = await db.collection('users').findOne(
            { _id: participantId },
            { projection: { name: 1, role: 1 } }
          );
          return user || { _id: participantId, name: 'Unknown', role: 'unknown' };
        })
      );
      
      // Get project info
      const projectInfo = await db.collection('projects').findOne(
        { _id: existing.project },
        { projection: { title: 1 } }
      );
      
      populatedConversation.participants = participantsInfo;
      populatedConversation.project = projectInfo || { title: 'Unknown Project' };
      
      return NextResponse.json({ success: true, conversation: populatedConversation });
    }

    // Create a new conversation
    const newConversation = {
      participants: participantObjectIds,
      project: projectObjectId,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('conversations').insertOne(newConversation);
    
    if (!result.insertedId) {
      return NextResponse.json(
        { success: false, error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    // Get participants info
    const participantsInfo = await Promise.all(
      participantObjectIds.map(async (participantId) => {
        const user = await db.collection('users').findOne(
          { _id: participantId },
          { projection: { name: 1, role: 1 } }
        );
        return user || { _id: participantId, name: 'Unknown', role: 'unknown' };
      })
    );
    
    // Get project info
    const projectInfo = await db.collection('projects').findOne(
      { _id: projectObjectId },
      { projection: { title: 1 } }
    );
    
    const createdConversation = {
      ...newConversation, 
      _id: result.insertedId,
      participants: participantsInfo,
      project: projectInfo || { title: 'Unknown Project' }
    };

    return NextResponse.json({ success: true, conversation: createdConversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
