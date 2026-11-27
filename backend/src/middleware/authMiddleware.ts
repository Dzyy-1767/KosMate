import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ENV } from '../config/env.js';
import { db } from '../config/database.js';

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

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!ENV.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is not configured');
  }

  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(`${ENV.SUPABASE_URL.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`),
    );
  }

  return jwks;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak ditemukan',
    });
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak valid',
    });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: `${ENV.SUPABASE_URL.replace(/\/$/, '')}/auth/v1`,
      audience: 'authenticated',
    });

    if (!payload.sub) {
      res.status(401).json({
        success: false,
        message: 'Token otentikasi tidak memiliki identitas pengguna',
      });
      return;
    }

    req.user = {
      id: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : '',
    };

    if (!db.users.has(payload.sub)) {
      const now = new Date();
      db.users.set(payload.sub, {
        id: payload.sub,
        name:
          typeof payload.user_metadata === 'object' &&
          payload.user_metadata &&
          'name' in payload.user_metadata &&
          typeof payload.user_metadata.name === 'string'
            ? payload.user_metadata.name
            : req.user.email || 'KosMate User',
        email: req.user.email,
        monthlyBudget: 1500000,
        createdAt: now,
        updatedAt: now,
      });
    }

    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Token otentikasi tidak dapat diverifikasi';
    console.error('Supabase JWT verification failed:', message);
    res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak valid atau sudah kedaluwarsa',
    });
  }
}
