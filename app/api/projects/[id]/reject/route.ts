import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    const projectId = params.id;
    console.log('Attempting to reject project with ID:', projectId);
    
    // Validate project ID format
    let projectObjectId;
    try {
      projectObjectId = new ObjectId(projectId);
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid project ID format' 
      }, { status: 400 });
    }
    
    // Find and update the project
    const result = await db.collection('projects').updateOne(
      { _id: projectObjectId },
      { 
        $set: { 
          rejected: true,
          approved: false,
          updatedAt: new Date().toISOString()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      console.log('Project not found for ID:', projectId);
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    // Get the updated project
    const updatedProject = await db.collection('projects').findOne({ _id: projectObjectId });
    
    console.log('Project rejected successfully:', projectId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project rejected successfully',
      project: updatedProject
    });
    
  } catch (error) {
    console.error('Reject project error:', error);
    const err = error as any;
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reject project',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
} 