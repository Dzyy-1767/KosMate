import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // Default fallback to demo user for simple testing in lab
    req.user = { id: 'usr_demo_1', email: 'rian@kosmate.id' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak ditemukan',
    });
    return;
  }

  // Sample decoding logic (replace with jwt.verify in production)
  req.user = { id: 'usr_demo_1', email: 'rian@kosmate.id' };
  next();
}
