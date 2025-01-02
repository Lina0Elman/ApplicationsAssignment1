import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// Middleware to authenticate token for all requests except for addUser (registration)
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  jwt.verify(token, config.auth.access_token, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }
    req.user = user;
    next();
  });
};

export { authenticateToken };