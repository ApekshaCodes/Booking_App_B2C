import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../../lib/db';
import User from '../../../../models/user';

export async function POST(req: NextRequest) {
  console.log('✅ POST /api/auth/signup triggered');
  try {
    const body = await req.json();
    console.log('📦 Received:', body);

    const { name, email, password } = body;

   const conn = await connectToDatabase();
    console.log('Connected to DB:', conn.connection.name);

    console.log('🔌 MongoDB connected');

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('⚠️ User already exists');
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    console.log('✅ User created:', user._id);

    return NextResponse.json({ message: 'User created', userId: user._id }, { status: 201 });
  } catch (error) {
    console.error('❌ Error in signup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
