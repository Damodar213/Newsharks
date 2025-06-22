import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { amount, investorId } = await request.json();

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid investment amount" },
        { status: 400 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Find the project
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Update the project funding
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      {
        $inc: {
          currentFunding: amount,
          investors: 1,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update project funding" },
        { status: 500 }
      );
    }

    // Get the updated project
    const updatedProject = await db.collection("projects").findOne({
      _id: new ObjectId(projectId),
    });

    return NextResponse.json({
      success: true,
      message: "Project funding updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project funding:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
} 