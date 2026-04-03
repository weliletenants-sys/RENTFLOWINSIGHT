import { EventEmitter } from 'events';
import prisma from '../prisma/prisma.client';

class FunderEventEmitter extends EventEmitter {}

export const FunderEventBus = new FunderEventEmitter();

// Known event constants
export const FUNDER_EVENTS = {
  DEPOSIT_REQUESTED: 'DEPOSIT_REQUESTED',
  WITHDRAWAL_REQUESTED: 'WITHDRAWAL_REQUESTED',
  INTERNAL_TRANSFER_SUCCESS: 'INTERNAL_TRANSFER_SUCCESS',
  P2P_TRANSFER_SUCCESS: 'P2P_TRANSFER_SUCCESS',
  PAYOUT_METHOD_ADDED: 'PAYOUT_METHOD_ADDED',
  // Triggered by Admin/System
  WALLET_CREDITED: 'WALLET_CREDITED',
  WITHDRAWAL_APPROVED: 'WITHDRAWAL_APPROVED',
  WITHDRAWAL_REJECTED: 'WITHDRAWAL_REJECTED',
  PORTFOLIO_MATURED: 'PORTFOLIO_MATURED',
  ROI_DISBURSED: 'ROI_DISBURSED'
} as const;

// Example Side-Effect Listener (can later be moved to workers/)
FunderEventBus.on(FUNDER_EVENTS.DEPOSIT_REQUESTED, async (payload: { userId: string, amount: number, provider: string }) => {
  try {
    await prisma.notifications.create({
      data: {
        user_id: payload.userId,
        type: 'deposit',
        title: 'Deposit Requested',
        message: `Your deposit request for ${payload.amount.toLocaleString()} UGX via ${payload.provider} is under review by the COO.`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to process DEPOSIT_REQUESTED side effect:', error);
  }
});

FunderEventBus.on(FUNDER_EVENTS.WITHDRAWAL_REQUESTED, async (payload: { userId: string, amount: number }) => {
  try {
    await prisma.notifications.create({
      data: {
        user_id: payload.userId,
        type: 'withdrawal',
        title: 'Withdrawal Requested',
        message: `Your withdrawal request for ${payload.amount.toLocaleString()} UGX is securely queued for manual review.`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to process WITHDRAWAL_REQUESTED side effect:', error);
  }
});

// P2P transfers trigger notifications for both sender and recipient
FunderEventBus.on(FUNDER_EVENTS.P2P_TRANSFER_SUCCESS, async (payload: { senderId: string, recipientId: string, amount: number, senderName: string, recipientName: string }) => {
  try {
    await prisma.notifications.createMany({
      data: [
        {
          user_id: payload.senderId,
          type: 'transfer_out',
          title: 'Funds Transferred',
          message: `You have successfully sent ${payload.amount.toLocaleString()} UGX to ${payload.recipientName}.`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: payload.recipientId,
          type: 'transfer_in',
          title: 'Funds Received',
          message: `You have received ${payload.amount.toLocaleString()} UGX from ${payload.senderName}.`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    console.error('Failed to process P2P_TRANSFER_SUCCESS side effect:', error);
  }
});
