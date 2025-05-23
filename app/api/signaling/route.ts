import { NextRequest, NextResponse } from 'next/server';

// In-memory store for signaling data
const rooms: { [key: string]: { [peerId: string]: any } } = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, peerId, type, payload } = body;
    
    if (!roomId || !peerId || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }
    
    // Handle different signal types
    if (type === 'join') {
      const peers = Object.keys(rooms[roomId]).filter(id => id !== peerId);
      rooms[roomId][peerId] = { lastSeen: Date.now() };
      
      return NextResponse.json({ 
        success: true, 
        peers
      });
    }
    
    if (type === 'offer' || type === 'answer' || type === 'ice-candidate') {
      const { target } = body;
      if (!target) {
        return NextResponse.json(
          { success: false, error: 'Missing target peer ID' },
          { status: 400 }
        );
      }
      
      // Store the signal for the target peer
      if (!rooms[roomId][target]) {
        rooms[roomId][target] = {
          signals: []
        };
      }
      
      if (!rooms[roomId][target].signals) {
        rooms[roomId][target].signals = [];
      }
      
      rooms[roomId][target].signals.push({
        from: peerId,
        type,
        payload
      });
      
      return NextResponse.json({ success: true });
    }
    
    if (type === 'poll') {
      // Return any pending signals for this peer and clear them
      const signals = rooms[roomId][peerId]?.signals || [];
      if (rooms[roomId][peerId]) {
        rooms[roomId][peerId].signals = [];
        rooms[roomId][peerId].lastSeen = Date.now();
      }
      
      return NextResponse.json({ 
        success: true, 
        signals 
      });
    }
    
    if (type === 'leave') {
      // Remove peer from room
      if (rooms[roomId] && rooms[roomId][peerId]) {
        delete rooms[roomId][peerId];
      }
      
      // Clean up empty rooms
      if (rooms[roomId] && Object.keys(rooms[roomId]).length === 0) {
        delete rooms[roomId];
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid signal type' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Signaling error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Cleanup function to remove stale peers
// In a real app, you would use a timeout or scheduled job
const STALE_TIMEOUT = 30000; // 30 seconds

setInterval(() => {
  const now = Date.now();
  
  Object.keys(rooms).forEach(roomId => {
    Object.keys(rooms[roomId]).forEach(peerId => {
      if (rooms[roomId][peerId].lastSeen && now - rooms[roomId][peerId].lastSeen > STALE_TIMEOUT) {
        delete rooms[roomId][peerId];
      }
    });
    
    if (Object.keys(rooms[roomId]).length === 0) {
      delete rooms[roomId];
    }
  });
}, STALE_TIMEOUT); 