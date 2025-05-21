import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Check if database connection is established
    if (!mongoose.connection.db) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection not established',
      }, { status: 500 });
    }
    
    // Get list of all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Get count of documents in each collection
    const collectionStats = await Promise.all(
      collections.map(async (collection) => {
        const count = await mongoose.connection.db!.collection(collection.name).countDocuments();
        return {
          name: collection.name,
          count,
          type: collection.type,
        };
      })
    );
    
    // Get database connection status
    const connectionStatus = {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
    
    return NextResponse.json({ 
      success: true, 
      connectionStatus,
      collections: collectionStats,
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch database information',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 