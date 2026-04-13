import { z } from 'zod';

export const createRentRequestSchema = z.object({
  body: z.object({
    propertyId: z.string().min(1, 'Property ID is required'),
    amount: z.number().positive('Amount must be a positive number'),
    months: z.number().positive('Months must be a positive number').int(),
  })
});

export const updateRentRequestStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Request ID is required'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'DEFAULTED']),
  })
});
