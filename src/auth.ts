import * as express from 'express';
import * as mongo from 'mongodb';
import { login } from './db';
import { Account } from './account';

export interface AuthRequest extends express.Request {
  user?: Account;
}

export function authenticate(db: mongo.Db): express.RequestHandler {
  return async (req: AuthRequest, res, next) => {
    if (typeof req?.headers?.authorization === 'string') {
      const [type, data] = req.headers.authorization.split(/\s+/);

      if (type === 'Basic' && typeof data === 'string') {
        const buf = Buffer.from(data, 'base64');
        const str = buf.toString('utf-8');
        const [username, password] = str.split(':');
        if (typeof username === 'string' && typeof password === 'string') {
          const user = await login(username, password, db);
          if (user) {
            req.user = user;
          }
        }
      }
    }
    next();
  };
}

const isAuthenticated: express.RequestHandler = (req: AuthRequest, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'You are not authorized to access this content.' })
  }
};