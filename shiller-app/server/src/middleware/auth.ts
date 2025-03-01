import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any; // Using any to bypass TypeScript errors
    }
  }
}

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

// Middleware to check if user is a shiller
export const shillerOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'shiller') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Shillers only.' });
  }
};

// Middleware for file upload
export const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({ message: 'Please upload a profile picture' });
    return;
  }
  next();
};
