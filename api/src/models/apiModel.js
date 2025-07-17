// models/Api.js
import mongoose from 'mongoose';

const apiSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  endpointUrl: {
    type: String,
    required: true,
  },
  rateLimitAlgorithm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RateLimitAlgorithm',
  },
  config: {
    type: mongoose.Schema.Types.Mixed, // flexible for algorithm-specific settings
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Api = mongoose.model('Api', apiSchema);
