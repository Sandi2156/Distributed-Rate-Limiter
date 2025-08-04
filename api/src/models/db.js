import mongoose from 'mongoose';
import { seedRateLimitAlgorithms } from '../utils/seedAlgorithms.js';

export async function connectMongo(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await seedRateLimitAlgorithms();

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
