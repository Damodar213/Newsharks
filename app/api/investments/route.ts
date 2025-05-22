import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Investment } from '@/models/Investment';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const investorId = searchParams.get('investor');
    
    if (!investorId) {
      return NextResponse.json(
        { success: false, error: 'Investor ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const investments = await Investment.find({ investor: investorId })
      .populate({
        path: 'project',
        select: 'title entrepreneur',
        populate: {
          path: 'entrepreneur',
          select: 'name email'
        }
      })
      .sort({ investedDate: -1 });
    
    return NextResponse.json({
      success: true,
      investments: investments
    });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
} 