import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Get project data from request body
    const body = await request.json();
    console.log("Project creation body (full):", JSON.stringify(body, null, 2));
    
    const { title, description, category, fundingGoal, equityOffering, timeline, businessPlan, userId } = body;
    
    // Log individual fields for debugging
    console.log("Validating required fields:");
    console.log("- title:", title);
    console.log("- description:", description);
    console.log("- category:", category);
    console.log("- fundingGoal:", fundingGoal);
    console.log("- equityOffering:", equityOffering);
    console.log("- userId:", userId);
    
    // Validate required fields
    if (!title || !description || !category || !fundingGoal || !equityOffering || !userId) {
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!description) missingFields.push('description');
      if (!category) missingFields.push('category');
      if (!fundingGoal) missingFields.push('fundingGoal');
      if (!equityOffering) missingFields.push('equityOffering');
      if (!userId) missingFields.push('userId');
      
      console.log("Missing required fields:", missingFields);
      
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields',
        missingFields: missingFields
      }, { status: 400 });
    }
    
    // Verify the user exists
    console.log("Attempting to find user with ID:", userId);
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      console.log("Invalid user ID format:", userId);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid user ID format' 
      }, { status: 400 });
    }
    
    const user = await db.collection('users').findOne({ _id: userObjectId });
    if (!user) {
      console.log("User not found with ID:", userId);
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    console.log("User found:", user.name, user.email);
    
    // Create new project
    const newProject = {
      title,
      description,
      category,
      fundingGoal: Number(fundingGoal),
      currentFunding: 0,
      investors: 0,
      equityOffering: Number(equityOffering),
      timeline: timeline || '',
      businessPlan: businessPlan || '',
      entrepreneur: userObjectId,
      approved: false,
      createdAt: new Date().toISOString()
    };
    
    const result = await db.collection('projects').insertOne(newProject);
    console.log("Project created successfully:", result.insertedId);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Project created successfully',
      project: {
        id: result.insertedId,
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
    const { db } = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const approved = searchParams.get('approved');
    const entrepreneur = searchParams.get('entrepreneur');
    
    // Build query based on parameters
    const query: any = {};
    if (approved === 'true') {
      query.approved = true;
    }
    if (entrepreneur) {
      try {
        query.entrepreneur = new ObjectId(entrepreneur);
      } catch (error) {
        console.error('Invalid entrepreneur ID:', entrepreneur);
      }
    }
    
    console.log("Projects query:", query);
    
    const projects = await db.collection('projects')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // For each project, look up the entrepreneur details
    const projectsWithEntrepreneurs = await Promise.all(
      projects.map(async (project) => {
        if (project.entrepreneur) {
          const entrepreneur = await db.collection('users').findOne(
            { _id: project.entrepreneur },
            { projection: { name: 1, email: 1 } }
          );
          
          return {
            ...project,
            entrepreneur: entrepreneur || { name: 'Unknown', email: 'unknown@example.com' }
          };
        }
        return project;
      })
    );
    
    return NextResponse.json({ 
      success: true, 
      projects: projectsWithEntrepreneurs
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
} 