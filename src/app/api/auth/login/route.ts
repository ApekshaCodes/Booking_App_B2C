import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../../lib/db';
import User from '../../../../models/user';
import { generateToken, generateRefreshToken } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  console.log('✅ POST /api/auth/login triggered');
  try {
    // Parse JSON body
    const { email, password } = await req.json();

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = generateToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    return NextResponse.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
