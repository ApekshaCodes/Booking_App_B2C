import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/user';
import { generateToken, generateRefreshToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = generateToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  res.status(200).json({ accessToken, refreshToken });
}
