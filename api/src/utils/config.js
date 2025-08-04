import dotenv from "dotenv";
dotenv.config();

export default {
  redis: {
    host: process.env.REDIS_HOST || "localhost:6379",
  },
  server: {
    port: parseInt(process.env.PORT) || 3000,
  },
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  db: {
    mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/ratelimiter",
  },
};
