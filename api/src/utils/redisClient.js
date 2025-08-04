import Redis from "ioredis";
import config from "./config.js";

const redisClient = new Redis(config.redis.host);

export default redisClient;
