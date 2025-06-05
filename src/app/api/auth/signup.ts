import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password } = req.body;
  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({ message: 'User created', userId: user._id  });
}
