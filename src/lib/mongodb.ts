import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const DB_NAME = "memoflare"; // use one name consistently (not "myapp" unless you mean that)

type MongoCache = {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongo: MongoCache | undefined;
}

const cached: MongoCache = global._mongo ?? {
  client: null,
  db: null,
  promise: null,
};
global._mongo = cached;

export async function connectMongo() {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const client = new MongoClient(uri);
      await client.connect();
      const db = client.db(DB_NAME);
      cached.client = client;
      cached.db = db;
      return { client, db };
    })();
  }

  return cached.promise;
}

export async function getDb() {
  const { db } = await connectMongo();
  return db;
}

export async function getMongoClient() {
  const { client } = await connectMongo();
  return client;
}