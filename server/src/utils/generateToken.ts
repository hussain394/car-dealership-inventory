import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: number;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? '1h';

  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};