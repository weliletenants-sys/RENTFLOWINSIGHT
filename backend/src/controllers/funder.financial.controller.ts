import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { problemResponse } from '../utils/problem';

const prisma = new PrismaClient();

/**
 * GET /api/funder/payout-methods
 * Retrieves all verified payout methods for the authenticated Funder
 */
export const getPayoutMethods = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const methods = await prisma.payoutMethods.findMany({
      where: { user_id: userId },
      orderBy: [
        { is_primary: 'desc' },
        { created_at: 'desc' }
      ]
    });

    return res.status(200).json({ status: 'success', data: { payoutMethods: methods } });
  } catch (error: any) {
    console.error('Error fetching payout methods:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not retrieve payout methods', 'internal-error');
  }
};

/**
 * POST /api/funder/payout-methods
 * Adds a new bank or mobile money payout method. Forces primary lock if it's the only one.
 */
export const addPayoutMethod = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const { provider, account_name, account_number, is_primary } = req.body;
    
    if (!provider || !account_name || !account_number) {
      return problemResponse(res, 400, 'Bad Request', 'Missing required payout method fields', 'validation-error');
    }

    // Determine if this should be forcefully primary (if it's the very first method)
    const existingCount = await prisma.payoutMethods.count({ where: { user_id: userId } });
    const shouldBePrimary = existingCount === 0 || is_primary === true;

    // Run atomically if it overrides others
    const newMethod = await prisma.$transaction(async (tx) => {
      if (shouldBePrimary) {
        await tx.payoutMethods.updateMany({
          where: { user_id: userId, is_primary: true },
          data: { is_primary: false }
        });
      }

      return await tx.payoutMethods.create({
        data: {
          user_id: userId,
          provider: provider.trim(),
          account_name: account_name.trim(),
          account_number: account_number.trim(),
          is_primary: shouldBePrimary
        }
      });
    });

    return res.status(201).json({ status: 'success', message: 'Payout method securely added', data: { payoutMethod: newMethod } });
  } catch (error: any) {
    console.error('Error adding payout method:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not add payout method', 'internal-error');
  }
};

/**
 * PUT /api/funder/payout-methods/:id/primary
 * Unsets all other primaries and locks the selected method as active
 */
export const setPrimaryPayoutMethod = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const targetMethod = await prisma.payoutMethods.findFirst({ where: { id, user_id: userId } });
    if (!targetMethod) return problemResponse(res, 404, 'Not Found', 'Payout method not found or unauthorized', 'not-found');

    await prisma.$transaction(async (tx) => {
      await tx.payoutMethods.updateMany({
        where: { user_id: userId, is_primary: true },
        data: { is_primary: false }
      });
      await tx.payoutMethods.update({
        where: { id },
        data: { is_primary: true }
      });
    });

    return res.status(200).json({ status: 'success', message: 'Primary payout method updated successfully' });
  } catch (error: any) {
    console.error('Error setting primary payout route:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not update primary method', 'internal-error');
  }
};

/**
 * DELETE /api/funder/payout-methods/:id
 * Safely removes a payout tunnel block
 */
export const deletePayoutMethod = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const targetMethod = await prisma.payoutMethods.findFirst({ where: { id, user_id: userId } });
    if (!targetMethod) return problemResponse(res, 404, 'Not Found', 'Payout method not found or unauthorized', 'not-found');

    await prisma.payoutMethods.delete({ where: { id } });

    // If we deleted the primary method, promote the next oldest to primary to maintain routing integrity
    if (targetMethod.is_primary) {
      const nextMethod = await prisma.payoutMethods.findFirst({
        where: { user_id: userId },
        orderBy: { created_at: 'asc' }
      });
      if (nextMethod) {
        await prisma.payoutMethods.update({
          where: { id: nextMethod.id },
          data: { is_primary: true }
        });
      }
    }

    return res.status(200).json({ status: 'success', message: 'Payout method disconnected securely.' });
  } catch (error: any) {
    console.error('Error deleting payout method:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not delete payout method', 'internal-error');
  }
};
// Trigger hot-reload block 1.0

// --- ESCROW CORE & PORTFOLIOS ---

export const getRewardMode = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const settings = await prisma.funderSettings.findUnique({
      where: { user_id: userId }
    });
    
    return res.status(200).json({ status: 'success', data: { reward_mode: settings?.reward_mode || 'compound' } });
  } catch (error: any) {
    console.error('Error fetching reward mode:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not fetch reward mode', 'internal-error');
  }
};

export const updateRewardMode = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const { mode } = req.body;
    if (mode !== 'compound' && mode !== 'payout') {
      return problemResponse(res, 400, 'Bad Request', 'Invalid reward mode', 'validation-error');
    }

    await prisma.funderSettings.upsert({
      where: { user_id: userId },
      update: { reward_mode: mode },
      create: { user_id: userId, reward_mode: mode }
    });

    return res.status(200).json({ status: 'success', message: `Rewards set to Auto-${mode === 'compound' ? 'Compound' : 'Payout'}` });
  } catch (error: any) {
    console.error('Error updating reward mode:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not update reward mode', 'internal-error');
  }
};

export const getWalletOperations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const operations = await prisma.pendingWalletOperations.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: { operations } });
  } catch (error: any) {
    console.error('Error fetching wallet operations:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not fetch wallet operations', 'internal-error');
  }
};

export const requestWalletWithdrawal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      return problemResponse(res, 400, 'Bad Request', 'Invalid withdrawal amount', 'validation-error');
    }

    // Security meta capture
    const ip_address = Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const device_info = req.headers['user-agent'] || 'Unknown Device';

    // 90-day escrow withdrawal simulation - strictly formatted using "debit"
    const withdrawal = await prisma.pendingWalletOperations.create({
      data: {
        user_id: userId,
        amount,
        direction: 'debit',
        category: 'withdrawal',
        reference_id: `WRW-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'pending_manager',
        ip_address,
        device_info
      }
    });

    return res.status(201).json({ status: 'success', message: 'Withdrawal queued successfully. Awaiting Manager Approval.', data: { withdrawal } });
  } catch (error: any) {
    console.error('Error requesting withdrawal:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not request withdrawal', 'internal-error');
  }
};

export const requestDeposit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const amount = Number(req.body.amount);
    const { provider, external_tx_id } = req.body;

    if (!amount || amount <= 0 || !provider || !external_tx_id) {
      return problemResponse(res, 400, 'Bad Request', 'Missing required deposit fields (amount, provider, transaction ID)', 'validation-error');
    }

    // Security meta capture
    const ip_address = Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const device_info = req.headers['user-agent'] || 'Unknown Device';

    const deposit = await prisma.pendingWalletOperations.create({
      data: {
        user_id: userId,
        amount,
        direction: 'credit',
        category: 'deposit',
        reference_id: `WRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        linked_party: provider.trim(),
        external_tx_id: external_tx_id.trim(),
        status: 'pending_manager',
        ip_address,
        device_info
      }
    });

    return res.status(201).json({ status: 'success', message: 'Deposit recorded securely. Awaiting Manager Audit verification.', data: { deposit } });
  } catch (error: any) {
    console.error('Error requesting deposit:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not request deposit', 'internal-error');
  }
};

export const getPortfolios = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const portfolios = await prisma.funderPortfolios.findMany({
      where: { user_id: userId },
      orderBy: { funding_date: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: { portfolios } });
  } catch (error: any) {
    console.error('Error fetching portfolios:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not fetch portfolios', 'internal-error');
  }
};
