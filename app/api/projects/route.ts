import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import User from '@/lib/models/User';

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get project data from request body
    const body = await request.json();
    console.log("Project creation body:", body);
    
    const { title, description, category, fundingGoal, equityOffering, timeline, businessPlan, userId } = body;
    
    // Validate required fields
    if (!title || !description || !category || !fundingGoal || !equityOffering || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    // Create new project
    const newProject = new Project({
      title,
      description,
      category,
      fundingGoal: Number(fundingGoal),
      equityOffering: Number(equityOffering),
      timeline: timeline || '',
      businessPlan: businessPlan || '',
      entrepreneur: userId,
      approved: false
    });
    
    await newProject.save();
    console.log("Project created successfully:", newProject._id);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Project created successfully',
      project: {
        id: newProject._id,
        title: newProject.title,
        category: newProject.category,
        fundingGoal: newProject.fundingGoal,
        equityOffering: newProject.equityOffering
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Project creation error:', error);
    const err = error as any;
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create project',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
}

// GET - Retrieve all projects or filter by entrepreneur
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const entrepreneurId = searchParams.get('entrepreneur');
    const approved = searchParams.get('approved');
    
    // Build query
    let query: any = {};
    
    if (entrepreneurId) {
      query.entrepreneur = entrepreneurId;
    }
    
    if (approved !== null) {
      query.approved = approved === 'true';
    }
    
    // Fetch projects based on query
    const projects = await Project.find(query)
      .populate('entrepreneur', 'name email')
      .sort({ createdAt: -1 });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      projects
    }, { status: 200 });
    
  } catch (error) {
    console.error('Get projects error:', error);
    const err = error as any;
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve projects',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
} 