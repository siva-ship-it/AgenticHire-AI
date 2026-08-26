import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    return mongoose.connection;
  } catch (error) {
    if (error.name === 'MongooseServerSelectionError') {
      const target = env.MONGODB_URI.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'MongoDB at 127.0.0.1:27017';
      const setupError = new Error(
        `Cannot connect to ${target}. Start MongoDB first or set MONGODB_URI in server/.env to a reachable database.`
      );
      setupError.code = 'MONGODB_UNAVAILABLE';
      setupError.cause = error;
      throw setupError;
    }
    throw error;
  }
}
