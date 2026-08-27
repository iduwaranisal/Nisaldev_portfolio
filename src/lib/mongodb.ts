import mongoose from "mongoose";
import dns from "dns";

// Configure high-reliability public DNS servers for MongoDB Atlas SRV record resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {
  // Ignore in environments where custom DNS servers cannot be set
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env or .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const MONGOOSE_OPTIONS: mongoose.ConnectOptions = {
  bufferCommands: true,
  serverSelectionTimeoutMS: 20000,
  connectTimeoutMS: 20000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  retryReads: true,
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  // 1. If connection already active (readyState === 1), return immediately
  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  // 2. If connection is currently connecting (readyState === 2) and promise exists, wait for it
  if (cached!.promise && mongoose.connection.readyState === 2) {
    try {
      cached!.conn = await cached!.promise;
      return cached!.conn;
    } catch {
      cached!.promise = null;
    }
  }

  // 3. If disconnected or stale, create a new connection promise
  if (!cached!.promise || mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached!.promise = (async () => {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          const m = await mongoose.connect(MONGODB_URI!, MONGOOSE_OPTIONS);
          return m;
        } catch (err) {
          console.warn(`[MongoDB] Connection attempt ${attempts}/${maxAttempts} failed:`, err instanceof Error ? err.message : err);
          if (attempts >= maxAttempts) {
            throw err;
          }
          // Exponential backoff wait (500ms, 1500ms)
          await new Promise((resolve) => setTimeout(resolve, attempts * 500));
        }
      }
      throw new Error("Unable to establish MongoDB connection after maximum retries.");
    })();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    cached!.conn = null;
    throw e;
  }

  return cached!.conn;
}
