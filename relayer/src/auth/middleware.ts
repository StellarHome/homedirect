import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken, JWTPayload } from './utils';

/**
 * Extend Express Request to include user info
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authentication middleware - verifies JWT token
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Role-based authorization middleware
 */
export function authorize(...allowedRoles: ('landlord' | 'tenant' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}

/**
 * Optional authentication - doesn't fail if no token
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req.headers.authorization);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}
