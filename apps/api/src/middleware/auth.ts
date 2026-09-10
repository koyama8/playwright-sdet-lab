import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../lib/tokens.js';
import { HttpError } from '../utils/http-error.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header('authorization');
  const [scheme, token] = header?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    next(new HttpError(401, 'Bearer token is required'));
    return;
  }
  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired access token'));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (req.auth?.role !== 'ADMIN') {
    next(new HttpError(403, 'Administrator role is required'));
    return;
  }
  next();
}
