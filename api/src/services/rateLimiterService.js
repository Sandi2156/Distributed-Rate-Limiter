// src/services/rateLimiterService.js
import redisClient from '../utils/redisClient.js';

// Token Bucket Algorithm
export async function tokenBucketCheck(userId, apiId, config) {
  
  const key = `ratelimit:token:${userId}:${apiId}`;
  const now = Math.floor(Date.now() / 1000);
  const refillRate = config.refillRate || 1; // tokens per second
  const capacity = config.capacity || 10;

  const data = await redisClient.hGetAll(key);
  let tokens = parseFloat(data.tokens) || capacity;
  let lastRefill = parseInt(data.lastRefill || now);

  const secondsPassed = now - lastRefill;
  tokens = Math.min(capacity, tokens + secondsPassed * refillRate);

  if (tokens >= 1) {
    tokens -= 1;
    await redisClient.hSet(key, {
      tokens: tokens.toFixed(2),
      lastRefill: now
    });
    return true;
  }

  return false;
}

// Fixed Window Algorithm
export async function fixedWindowCheck(userId, apiId, config) {

  const windowSeconds = config.windowSeconds || 60;
  const limit = config.requests || 10;

  const windowKey = `ratelimit:fixed:${userId}:${apiId}`;

  const currentCount = await redisClient.incr(windowKey);
  if (currentCount === 1) {
    await redisClient.expire(windowKey, windowSeconds);
  }

  return currentCount <= limit;
}

// Sliding Window Algorithm (using sorted sets)
export async function slidingWindowCheck(userId, apiId, config) {
  const windowSeconds = config.windowSeconds || 60;
  const limit = config.requests || 10;

  const key = `ratelimit:sliding:${userId}:${apiId}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  // Remove entries outside the window
  await redisClient.zRemRangeByScore(key, 0, windowStart);

  const count = await redisClient.zCard(key);

  if (count >= limit) return false;

  await redisClient.zAdd(key, [{ score: now, value: now.toString() }]);
  await redisClient.expire(key, windowSeconds);

  return true;
}

// Central Rate Limit Dispatcher
export async function rateLimitCheck(userId, api, config) {
  config = JSON.parse(config);
  const algorithm = api.rateLimitAlgorithm?.name;

  switch (algorithm) {
    case 'token_bucket':
      return tokenBucketCheck(userId, api._id, config);
    case 'fixed_window':
      return fixedWindowCheck(userId, api._id, config);
    case 'sliding_window':
      return slidingWindowCheck(userId, api._id, config);
    default:
      return true; // Allow if algorithm not recognized
  }
}
