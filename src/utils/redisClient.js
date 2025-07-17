import Redis from "ioredis";
import config from "../config.js";

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

export default redisClient;