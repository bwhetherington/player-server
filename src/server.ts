import * as express from 'express';
import { initDb, createAccountView, Password } from './db';
import * as morgan from 'morgan';
import * as path from 'path';
import { hashPassword } from './util';
import { authenticate, AuthRequest, isAuthenticated, hasDBAccess } from './auth';
import { Account, isAccount } from './account';

const port = process.env.PORT ?? 3030;

const DISALLOWED_PASSWORDS = [
  'password'
];

function isDisallowedPassword(password: string): boolean {
  return DISALLOWED_PASSWORDS.includes(password.toLowerCase());
}

function isValidPassword(password: string): boolean {
  return password.length >= 6 && !isDisallowedPassword(password);
}

export async function initServer(): Promise<express.Express> {
  const db = await initDb();
  const app = express();

  app.use(morgan('tiny'));
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());
  app.use(authenticate(db));

  app.get('/user/:username', async (req: AuthRequest, res) => {
    const { username } = req.params as { username?: string };
    if (username) {
      const player = await db.collection('accounts')
        .findOne({ username });
      if (player) {
        const view = createAccountView(player);
        res.json(view);
      } else {
        res.status(404).json({ message: `User '${username}' not found` });
      }
    } else {
      res.status(404).json({ message: `User '${username}' not found` });
    }
  });

  app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are valid
    if (typeof username === 'string' && typeof password === 'string') {

      // Check if password is valid
      if (!isValidPassword(password)) {
        res.status(409).json({ message: 'Selected password is invalid' });
        return;
      }

      // Check if account with this username already exists
      if (await db.collection('accounts').findOne({ username })) {
        res.status(409).json({ message: 'An account with that username already exists' });
        return;
      }

      const passwordHash = await hashPassword(password);

      const account: Password<Account> = {
        username: username.toLowerCase(),
        passwordHash,
        className: 'Hero',
        xp: 0,
        permissionLevel: 0
      };

      await db.collection('accounts')
        .insertOne(account);

      const view = createAccountView(account);
      res.status(200).json(view);
    } else {
      res.status(400).json({ message: 'Account username or password was not properly specified.' });
    }
  });

  app.get('/login', async (req: AuthRequest, res) => {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(401).json({ message: 'Invalid login credentials.' });
    }
  });

  app.post('/update', hasDBAccess, async (req: AuthRequest, res) => {
    // Check that the validated user is the same as the user being updated
    if (isAccount(req.body)) {
      await db.collection('accounts')
        .findOneAndUpdate({ username: req.user.username }, { $set: req.body });
      res.status(200).json({ message: 'User updated successfully.' });
    } else {
      res.status(401).json({ message: 'Unauthorized access.' });
    }
  });

  app.get('/', (req, res) => {
    const file = path.join(__dirname, '..', 'index.html');
    res.sendFile(file);
  });

  return app;
}