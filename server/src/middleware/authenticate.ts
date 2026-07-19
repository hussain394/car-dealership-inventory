import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError';

export interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing or malformed authorization header'));
  }

  const token = header.split(' ')[1];
  const secret = process.env.JWT_SECRET as string;

  try {
    const payload = jwt.verify(token, secret) as unknown as {
      userId: number;
      role: string;
    };
    req.user = payload;
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};