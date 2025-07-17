// src/services/algorithmService.js
import { RateLimitAlgorithm } from '../models/algorithmModel.js';

export async function getAllAlgorithms() {
  try {
    return await RateLimitAlgorithm.find().lean();
  } catch (err) {
    console.error('AlgorithmService Error:', err);
    throw new Error('Failed to fetch algorithms');
  }
}
