import { z } from 'zod';

export const amountSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number'),
  })
});

export const transferSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number'),
    recipientId: z.string().min(1, 'Recipient ID is required'),
  })
});

export const requestDepositSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number'),
    transactionId: z.string().min(1, 'Transaction ID is required'),
    provider: z.string().optional(),
    notes: z.string().optional(),
  })
});
