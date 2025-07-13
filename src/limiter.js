import Redis from "ioredis";
import config from "./config.js";

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

export async function checkRateLimit(clientId, limit, windowInSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / windowInSeconds) * windowInSeconds;

  const key = `rate:${clientId}:${windowStart}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, windowInSeconds);
  }

  if (count > limit) {
    const ttl = await redis.ttl(key);
    return { allowed: false, retryAfter: ttl };
  }

  return { allowed: true, remaining: limit - count };
}
