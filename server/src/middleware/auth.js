import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/api.js';

export function requireAuth(req, _res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return next(new AppError(401, 'Authentication required', 'UNAUTHORIZED'));
  try { req.user = jwt.verify(token, env.JWT_SECRET); next(); }
  catch { next(new AppError(401, 'Invalid or expired token', 'UNAUTHORIZED')); }
}
