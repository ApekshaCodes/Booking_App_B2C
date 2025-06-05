// import { NextApiRequest, NextApiResponse } from 'next';
// import jwt from 'jsonwebtoken';

// export function withAuth(handler: Function) {
//   return async (req: NextApiRequest, res: NextApiResponse) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ error: 'Token missing' });

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//       (req as any).user = decoded;
//       return handler(req, res);
//     } catch (err) {
//       return res.status(401).json({ error: 'Invalid token' });
//     }
//   };
// }


import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends NextApiRequest {
  user?: any;
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      (req as AuthenticatedRequest).user = decoded;
      return handler(req as AuthenticatedRequest, res);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}
