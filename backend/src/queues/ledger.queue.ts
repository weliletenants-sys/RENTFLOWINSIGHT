import { Queue } from 'bullmq';
import getRedisClient from '../config/redis.client';

/**
 * BullMQ Ledger Queue
 * High-performance async enqueueing point for all financial transations.
 */
export const ledgerQueue = new Queue('LedgerTransactionsQueue', {
  connection: getRedisClient(),
  defaultJobOptions: {
    attempts: 3,                 // Maximum retry threshold
    backoff: {
      type: 'exponential',
      delay: 2000,              // 2s, 4s, 8s exponential progression
    },
    removeOnComplete: 1000,      // Keep last 1000 success jobs for debug
    removeOnFail: false,         // Never remove failed jobs automatically, push to DLQ mechanism theoretically
  }
});

/**
 * Standardized payload structure injected from Controller
 */
export interface AsyncLedgerJobPayload {
  idempotencyKey: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  category: string;
  description?: string;
  sourceTable?: string;
  sourceId?: string;
  actor: {
    id: string;
    role: string;
    scopes: string[];
  };
}

// Helper Enqueue function
export const enqueueLedgerTransaction = async (payload: AsyncLedgerJobPayload) => {
  // Push to Queue explicitly matching Job ID to idempotency logic for exact deduplication native to BullMQ
  return await ledgerQueue.add('process_transfer', payload, {
    jobId: payload.idempotencyKey // Hard native deduplication
  });
};
