import { Worker, Job } from 'bullmq';
import { getRedisClient } from '../config/redis.client';
import { FUNDER_EVENTS } from '../events/funder.events';
import prisma from '../prisma/prisma.client';
import { v4 as uuidv4 } from 'uuid';

const redisClient = getRedisClient();

export const funderWorker = new Worker('funder_queue', async (job: Job) => {
  const eventName = job.name;
  const payload = job.data;

  console.log(`[Worker] Processing Job [${job.id}]: ${eventName}`);

  switch (eventName) {
    case FUNDER_EVENTS.DEPOSIT_REQUESTED:
      await prisma.notifications.create({
        data: {
          id: uuidv4(),
          user_id: payload.userId,
          title: 'Deposit Initiated',
          body: `We are securely processing your deposit of ₦${payload.amount.toLocaleString()}. It will be credited shortly.`,
          type: 'SYSTEM',
        }
      });
      break;
    
    case FUNDER_EVENTS.WALLET_CREDITED:
      await prisma.notifications.create({
        data: {
          id: uuidv4(),
          user_id: payload.userId,
          title: 'Deposit Successful',
          body: `Your wallet has been credited with ₦${payload.amount.toLocaleString()}.`,
          type: 'INFO',
        }
      });
      break;

    case FUNDER_EVENTS.P2P_TRANSFER_SUCCESS:
      await prisma.notifications.createMany({
        data: [
          {
            id: uuidv4(),
            user_id: payload.senderId,
            title: 'Transfer Sent',
            body: `You successfully sent ₦${payload.amount.toLocaleString()} to your peer.`,
            type: 'INFO'
          },
          {
            id: uuidv4(),
            user_id: payload.recipientId,
            title: 'Funds Received',
            body: `You just received ₦${payload.amount.toLocaleString()} in your wallet!`,
            type: 'INFO'
          }
        ]
      });
      break;

    case FUNDER_EVENTS.WITHDRAWAL_REQUESTED:
      await prisma.notifications.create({
        data: {
          id: uuidv4(),
          user_id: payload.userId,
          title: 'Withdrawal Processing',
          body: `Your withdrawal of ₦${payload.amount.toLocaleString()} is currently being verified.`,
          type: 'SYSTEM',
        }
      });
      break;

    case FUNDER_EVENTS.ANGEL_POOL_INVESTMENT:
      await prisma.notifications.create({
        data: {
          id: uuidv4(),
          user_id: payload.userId,
          title: 'Angel Pool Commitment',
          body: `You successfully secured ${payload.shares} shares in the premium liquidity tier.`,
          type: 'INFO',
        }
      });
      break;

    default:
      console.log(`[Worker] No dedicated logic defined for: ${eventName}`);
  }
}, { 
  connection: redisClient,
  concurrency: 5 // Handle 5 concurrent durable jobs for high-throughput
});

funderWorker.on('completed', job => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

funderWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error:`, err);
});
