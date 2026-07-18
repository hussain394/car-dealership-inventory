import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';
import { ApiError } from '../utils/apiError';

export const authorize =
  (...allowedRoles: string[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
