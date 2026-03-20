import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

/**
 * GET /api/v1/admin/reconciliation
 * Executes the Phase 3 global integrity check across all user wallets.
 */
export const getGlobalReconciliation = async (req: Request, res: Response) => {
  try {
    const wallets = await prisma.wallets.findMany();

    const results = [];
    let mathErrors = 0;

    // In a massive production system, this could be offset/paginated, 
    // but the CFO query expects a synchronous sweeping check for the dashboard.
    for (const wallet of wallets) {
      const buckets = await prisma.walletBuckets.findMany({
        where: { wallet_id: wallet.id }
      });
      const sum = buckets.reduce((acc, curr) => acc + curr.balance, 0);

      const isUnbalanced = Math.abs(wallet.balance - sum) > 0.01;
      if (isUnbalanced) {
        mathErrors++;
        results.push({
          walletId: wallet.id,
          userId: wallet.user_id,
          email: wallet.user?.email || 'Unknown',
          legacyTotal: wallet.balance,
          bucketSum: sum,
          discrepancy: wallet.balance - sum,
          isFrozen: true
        });

        // Automatically freeze unbalanced accounts
        if (wallet.user_id) {
          await prisma.profiles.update({
            where: { id: wallet.user_id },
            data: { is_frozen: true, frozen_reason: 'CFO Reconciliation Mismatch' }
          });
        }
      }
    }

    return res.status(200).json({
      status: mathErrors === 0 ? 'HEALTHY' : 'CRITICAL_DISCREPANCY',
      totalWalletsChecked: wallets.length,
      unbalancedCount: mathErrors,
      unbalancedWallets: results
    });
  } catch (error) {
    console.error('getGlobalReconciliation error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed reconciliation', 'urn:rentflow:error:internal');
  }
};

/**
 * POST /api/v1/admin/reconciliation/:userId/resolve
 * Manually unfreezes an account after operations has fixed the math.
 */
export const resolveWalletMismatch = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) return problemResponse(res, 404, 'Not Found', 'Profile not found', 'urn:rentflow:error:not-found');

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) return problemResponse(res, 404, 'Not Found', 'Wallet not found', 'urn:rentflow:error:not-found');

    // Force balance validation again before unfreezing
    const buckets = await prisma.walletBuckets.findMany({ where: { wallet_id: wallet.id } });
    const sum = buckets.reduce((acc, curr) => acc + curr.balance, 0);

    if (Math.abs(wallet.balance - sum) > 0.01) {
      return problemResponse(res, 400, 'Bad Request', `Wallet mismatch unresolved! (Legacy: ${wallet.balance}, Buckets: ${sum})`, 'urn:rentflow:error:unresolved');
    }

    await prisma.profiles.update({
      where: { id: userId },
      data: { is_frozen: false, frozen_reason: null }
    });

    return res.status(200).json({ message: 'Account algebraically validated and unfrozen.' });
  } catch (error) {
    console.error('resolveWalletMismatch error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to resolve mismatch', 'urn:rentflow:error:internal');
  }
};
