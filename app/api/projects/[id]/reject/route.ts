import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const projectId = params.id;
    
    // Find and update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { approved: false },
      { new: true }
    );
    
    if (!updatedProject) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
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