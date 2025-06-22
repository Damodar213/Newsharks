import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const investor = searchParams.get("investor");
    
    if (!investor) {
      return NextResponse.json(
        { success: false, error: "Investor ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const investments = await db.collection("investments")
      .find({ investor: investor })
      .toArray();
      
    return NextResponse.json({
      success: true,
      investments,
    });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const investmentData = await request.json();
    
    // Validate required fields
    if (!investmentData.project || !investmentData.investor || !investmentData.amountInvested) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Add timestamps
    const investment = {
      ...investmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = await db.collection("investments").insertOne(investment);
    
    if (!result.insertedId) {
      return NextResponse.json(
        { success: false, error: "Failed to create investment" },
        { status: 500 }
      );
    }
    
    // Get the created investment
    const createdInvestment = await db.collection("investments").findOne({
      _id: result.insertedId,
    });
    
    return NextResponse.json({
      success: true,
      message: "Investment created successfully",
      investment: createdInvestment,
    });
  } catch (error) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
} 