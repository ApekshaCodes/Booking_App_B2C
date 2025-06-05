import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI in .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  console.log('🔌 Connecting to MongoDB...');
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log('🌐 No cached connection found, creating a new one...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'bookingApp', 
      bufferCommands: false,
    });

    console.log('🔗 Mongoose connection promise created');
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
