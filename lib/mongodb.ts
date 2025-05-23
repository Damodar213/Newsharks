import mongoose from 'mongoose';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  try {
    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      console.log('Connecting to MongoDB...');
      // TypeScript non-null assertion operator to tell TypeScript that MONGODB_URI is not null
      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      console.error('MongoDB connection error:', e);
      throw e;
    }

    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
} 