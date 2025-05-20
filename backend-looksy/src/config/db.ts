import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config()

const MONGO_URI = process.env.MONGO_URI as string;

if(!MONGO_URI) {
    throw new Error('🚫 MONGO_URI not found in .env file');
}

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected')
})

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('⛔ MongoDB connection closed due to app termination');
  process.exit(0);
});

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};