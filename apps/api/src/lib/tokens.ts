import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'USER';
  type: 'access';
}

export function signAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload !== 'object' || payload.type !== 'access' || typeof payload.sub !== 'string') {
    throw new Error('Invalid access token');
  }
  return payload as AccessTokenPayload;
}

export function createRefreshToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashToken(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}
