// src/utils/seedAlgorithms.js
import { RateLimitAlgorithm } from '../models/algorithmModel.js';

const predefinedAlgorithms = [
  {
    name: 'token_bucket',
    description: 'Allows a burst of requests and refills tokens at a steady rate.',
  },
  {
    name: 'fixed_window',
    description: 'Limits requests in fixed time windows (e.g., 100 requests per minute).',
  },
  {
    name: 'sliding_window',
    description: 'Similar to fixed window but calculates over a sliding time range.',
  }
];

export async function seedRateLimitAlgorithms() {
  try {
    for (const algo of predefinedAlgorithms) {
      const exists = await RateLimitAlgorithm.findOne({ name: algo.name });
      if (!exists) {
        await RateLimitAlgorithm.create(algo);
        console.log(`Seeded algorithm: ${algo.name}`);
      }
    }
  } catch (err) {
    console.error('Error seeding rate limit algorithms:', err);
    throw err;
  }
}
