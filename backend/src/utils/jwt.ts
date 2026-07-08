import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  const expiresInSeconds = 7 * 24 * 60 * 60;
  return jwt.sign(payload as object, config.jwtSecret, { expiresIn: expiresInSeconds });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
