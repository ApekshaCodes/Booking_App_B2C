import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export function withAuth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      (req as any).user = decoded;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
