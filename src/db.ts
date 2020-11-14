import * as mongo from 'mongodb';
import { hashPassword, comparePassword } from './util';
import { Account } from './account';

let uri = undefined as string | undefined;
function getURI(): string {
  if (!uri) {
    uri = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@bwhetherington.com:27017`;
  }
  return uri;
}

let connection = undefined as mongo.MongoClient | undefined;

const MONGO_SETTINGS = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

export async function connect(): Promise<mongo.MongoClient | undefined> {
  if (connection) {
    return connection;
  }
  if (getURI()) {
    const client = await mongo.MongoClient.connect(getURI(), MONGO_SETTINGS);
    connection = client;
    return client;
  }
}

export type Password<T> = T & { passwordHash: string };

export function createAccountView(account: Password<Account>): Account {
  const newObj = { ...account };
  delete newObj.passwordHash;
  return newObj;
}

export async function initDb(): Promise<mongo.Db> {
  const client = await connect();
  const playerdb = client.db('playerdb');

  // Initialize admin account
  const admin: Password<Account> = {
    username: 'admin',
    passwordHash: await hashPassword('admin'),
    xp: 0,
    className: 'Hero',
    permissionLevel: 2,
  };

  await playerdb.collection('accounts')
    .updateOne({ username: 'admin' }, { $setOnInsert: admin }, { upsert: true });

  return playerdb;
}

export async function login(username: string, password: string, db: mongo.Db): Promise<Account | undefined> {
  const player = await db.collection('accounts')
    .findOne({ username: username.toLowerCase() });
  if (player && typeof player.passwordHash === 'string') {
    if (await comparePassword(password, player.passwordHash)) {
      return createAccountView(player);
    }
  }
}