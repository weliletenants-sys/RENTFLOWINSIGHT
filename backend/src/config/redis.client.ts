import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Single cached global instance
let redisClient: Redis;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null, // Required by bullmq
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis server.');
    });
  }
  return redisClient;
};

export default getRedisClient;
