import { Queue } from 'bullmq';
import { getRedisClient } from '../config/redis.client';

export const FUNDER_EVENTS = {
  DEPOSIT_REQUESTED: 'DEPOSIT_REQUESTED',
  WITHDRAWAL_REQUESTED: 'WITHDRAWAL_REQUESTED',
  INTERNAL_TRANSFER_SUCCESS: 'INTERNAL_TRANSFER_SUCCESS',
  P2P_TRANSFER_SUCCESS: 'P2P_TRANSFER_SUCCESS',
  PAYOUT_METHOD_ADDED: 'PAYOUT_METHOD_ADDED',
  WALLET_CREDITED: 'WALLET_CREDITED',
  WITHDRAWAL_APPROVED: 'WITHDRAWAL_APPROVED',
  WITHDRAWAL_REJECTED: 'WITHDRAWAL_REJECTED',
  PORTFOLIO_MATURED: 'PORTFOLIO_MATURED',
  ROI_DISBURSED: 'ROI_DISBURSED',
  ANGEL_POOL_INVESTMENT: 'ANGEL_POOL_INVESTMENT'
} as const;

const redisClient = getRedisClient();

export const funderQueue = new Queue('funder_queue', {
  connection: redisClient
});

class ResilientFunderEventBus {
  async emit(eventName: string, payload: any) {
    try {
      // 1. Immediately fan-out UI invalidations over Pub/Sub
      if (payload.userId) {
        await redisClient.publish(`sse:user:${payload.userId}`, JSON.stringify({ eventName, payload }));
      }
      if (payload.senderId && payload.recipientId) {
        await redisClient.publish(`sse:user:${payload.senderId}`, JSON.stringify({ eventName, payload }));
        await redisClient.publish(`sse:user:${payload.recipientId}`, JSON.stringify({ eventName, payload }));
      }

      // 2. Offload processing-heavy side effect (like DB creation) to BullMQ Queue
      await funderQueue.add(eventName, payload, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: 100,
      });
    } catch (error) {
      console.error(`Failed to dispatch event ${eventName}:`, error);
    }
  }

  // Stub methods to prevent crashes where controllers might still try to bind locally
  on(eventName: string, callback: any) {}
  off(eventName: string, callback: any) {}
}

export const FunderEventBus = new ResilientFunderEventBus();
