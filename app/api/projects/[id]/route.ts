import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Get a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    const { id: projectId } = params;
    
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
    
    // Find the project
    const project = await db.collection('projects').findOne({ _id: projectObjectId });
    
    // Check if project exists
    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    // Get entrepreneur info if available
    if (project.entrepreneur) {
      const entrepreneur = await db.collection('users').findOne(
        { _id: project.entrepreneur },
        { projection: { name: 1, email: 1 } }
      );
      
      if (entrepreneur) {
        project.entrepreneur = entrepreneur;
      }
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      project
    }, { status: 200 });
    
  } catch (error) {
    console.error('Get project error:', error);
    const err = error as any;
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve project',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update a project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    const { id: projectId } = params;
    
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
    
    // Get project update data from request body
    const body = await request.json();
    const { title, description, category, fundingGoal, equityOffering, timeline, businessPlan, approved } = body;
    
    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (fundingGoal !== undefined) updateData.fundingGoal = Number(fundingGoal);
    if (equityOffering !== undefined) updateData.equityOffering = Number(equityOffering);
    if (timeline !== undefined) updateData.timeline = timeline;
    if (businessPlan !== undefined) updateData.businessPlan = businessPlan;
    if (approved !== undefined) updateData.approved = approved;
    
    // Find and update the project
    const result = await db.collection('projects').updateOne(
      { _id: projectObjectId },
      { $set: updateData }
    );
    
    // Check if project exists
    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    // Get the updated project
    const updatedProject = await db.collection('projects').findOne({ _id: projectObjectId });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Project updated successfully',
      project: updatedProject
    }, { status: 200 });
    
  } catch (error) {
    console.error('Update project error:', error);
    const err = error as any;
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update project',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete a project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    const { id: projectId } = params;
    
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
    
    // Find and delete the project
    const result = await db.collection('projects').deleteOne({ _id: projectObjectId });
    
    // Check if project exists
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Delete project error:', error);
    const err = error as any;
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete project',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
} 