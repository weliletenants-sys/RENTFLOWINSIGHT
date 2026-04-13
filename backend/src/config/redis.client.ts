import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Single cached global instance
let redisClient: Redis;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null, // Required by bullmq
      retryStrategy: (times) => {
        if (!process.env.REDIS_URL && times > 1) {
          console.warn('[System] Redis is locally offline. Giving up connection to prevent log floods.');
          return null; // Fatal give-up dynamically
        }
        return Math.min(times * 100, 3000); // Retry with backoff for production resilience
      }
    });
    
    redisClient.on('error', (err) => {
      // Suppress the giant aggregate trace locally
      if (err.code === 'ECONNREFUSED') return; 
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis server.');
    });
  }
  return redisClient;
};

export default getRedisClient;
