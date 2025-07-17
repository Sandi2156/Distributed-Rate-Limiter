// models/RateLimitAlgorithm.js
import mongoose from 'mongoose';

const rateLimitAlgorithmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['token_bucket', 'fixed_window', 'sliding_window'],
  },
  description: {
    type: String,
  },
});

export const RateLimitAlgorithm = mongoose.model('RateLimitAlgorithm', rateLimitAlgorithmSchema);
