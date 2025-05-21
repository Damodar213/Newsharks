import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import mongoose from 'mongoose';

// GET - Get a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const projectId = params.id;
    
    // Validate project ID format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid project ID format' 
      }, { status: 400 });
    }
    
    // Find the project
    const project = await Project.findById(projectId)
      .populate('entrepreneur', 'name email');
    
    // Check if project exists
    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
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
    await connectToDatabase();
    
    const projectId = params.id;
    
    // Validate project ID format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid project ID format' 
      }, { status: 400 });
    }
    
    // Get project update data from request body
    const body = await request.json();
    const { title, description, category, fundingGoal, equityOffering, timeline, businessPlan, approved } = body;
    
    // Find and update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(fundingGoal && { fundingGoal: Number(fundingGoal) }),
        ...(equityOffering && { equityOffering: Number(equityOffering) }),
        ...(timeline !== undefined && { timeline }),
        ...(businessPlan !== undefined && { businessPlan }),
        ...(approved !== undefined && { approved }),
      },
      { new: true, runValidators: true }
    );
    
    // Check if project exists
    if (!updatedProject) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
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
    await connectToDatabase();
    
    const projectId = params.id;
    
    // Validate project ID format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid project ID format' 
      }, { status: 400 });
    }
    
    // Find and delete the project
    const deletedProject = await Project.findByIdAndDelete(projectId);
    
    // Check if project exists
    if (!deletedProject) {
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