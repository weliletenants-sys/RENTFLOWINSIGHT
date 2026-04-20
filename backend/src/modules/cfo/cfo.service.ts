import prisma from '../../prisma/prisma.client';
import { v4 as uuidv4 } from 'uuid';

interface TopUpParams {
  portfolioId: string;
  amount: number;
  currency: string;
  initiatorId: string;
  isProxyFunding: boolean;
  idempotencyKey: string;
}

interface MergeParams {
  portfolioId: string;
  initiatorId: string;
  idempotencyKey: string;
}

export class CfoService {
  
  public async processPortfolioTopUp(params: TopUpParams) {
    const { portfolioId, amount, initiatorId, isProxyFunding, idempotencyKey } = params;

    // Check for idempotency
    const existingTx = await prisma.ledgerTransactions.findUnique({
      where: { idempotency_key: idempotencyKey }
    });

    if (existingTx) {
      return { status: 'already_processed', transaction: existingTx };
    }

    // Determine state machine
    const status = isProxyFunding ? 'PENDING_APPROVAL' : 'APPROVED';

    return await prisma.$transaction(async (tx) => {
      // 1. Execute Ledger Transaction Record
      const ledgerTx = await tx.ledgerTransactions.create({
        data: {
          idempotency_key: idempotencyKey,
          category: 'pending_portfolio_topup',
          created_at: new Date().toISOString(),
          description: `Portfolio Top-Up: ${portfolioId}`,
          initiated_by: initiatorId,
          source_table: 'angel_pool_investments',
          source_id: portfolioId,
          status,
          is_proxy_funding: isProxyFunding,
          approval_timestamp: isProxyFunding ? null : new Date(),
          approved_by: isProxyFunding ? null : initiatorId,
        }
      });

      // 2. Perform Double-Entry accounting if APPROVED immediately
      // If it's pending proxy, we still create the ledger transaction for audit but might withhold GL until approved?
      // Wait, standard accounting normally logs it immediately to suspense with PENDING state, or delays GL.
      // We will lodge it to the GL as PENDING, or just wait for the merge.
      // The user says "Top up: Debit USER_WALLET, Credit PORTFOLIO_PENDING_TOPUPS"
      
      const userWalletAccountId = `USER_WALLET_${initiatorId}`;
      const pendingAccountId = `PORTFOLIO_PENDING_TOPUPS_${portfolioId}`;

      // Insert Leg 1: Debit USER_WALLET
      await tx.generalLedger.create({
        data: {
          transaction_id: ledgerTx.id,
          account_id: userWalletAccountId,
          account_type: 'liability',
          entry_type: 'debit',
          amount,
          category: 'pending_portfolio_topup',
          description: `Debit User Wallet for TopUp`,
          linked_party: initiatorId,
          source_id: portfolioId,
          source_table: 'angel_pool_investments',
          scope: 'wallet',
        }
      });

      // Insert Leg 2: Credit PORTFOLIO_PENDING_TOPUPS
      await tx.generalLedger.create({
        data: {
          transaction_id: ledgerTx.id,
          account_id: pendingAccountId,
          account_type: 'liability',
          entry_type: 'credit',
          amount,
          category: 'pending_portfolio_topup',
          description: `Credit Pending TopUps`,
          linked_party: initiatorId,
          source_id: portfolioId,
          source_table: 'angel_pool_investments',
          scope: 'platform',
        }
      });

      return { status: 'processed', transaction: ledgerTx };
    });
  }

  public async mergePendingTopUps(params: MergeParams) {
    const { portfolioId, initiatorId, idempotencyKey } = params;

    // Check Idempotency
    const existingTx = await prisma.ledgerTransactions.findUnique({
      where: { idempotency_key: idempotencyKey }
    });

    if (existingTx) {
      return { status: 'already_processed', transaction: existingTx };
    }

    return await prisma.$transaction(async (tx) => {
      // 1. SELECT ... FOR UPDATE to lock the pending transactions for this portfolio
      // We find all ledger_transactions for this portfolio that are APPROVED (not yet merged/posted)
      const pendingTxs = await tx.$queryRaw<any[]>`
        SELECT * FROM "ledger_transactions" 
        WHERE "source_id" = ${portfolioId} 
          AND "category" = 'pending_portfolio_topup'
          AND "status" = 'APPROVED'
        FOR UPDATE SKIP LOCKED
      `;

      if (pendingTxs.length === 0) {
        throw new Error('No approved pending top-ups available to merge.');
      }

      // Calculate total amount to merge from the General Ledger associated with these txns
      const txIds = pendingTxs.map(t => t.id);
      
      const glEntries = await tx.generalLedger.findMany({
        where: {
          transaction_id: { in: txIds },
          account_id: `PORTFOLIO_PENDING_TOPUPS_${portfolioId}`,
          entry_type: 'credit'
        }
      });

      const totalAmount = glEntries.reduce((sum, entry) => sum + entry.amount, 0);

      if (totalAmount <= 0) {
        throw new Error('Calculated merge amount is zero or invalid.');
      }

      // Create Merge Transaction
      const mergeTx = await tx.ledgerTransactions.create({
        data: {
          idempotency_key: idempotencyKey,
          category: 'partner_funding',
          created_at: new Date().toISOString(),
          description: `Merge Pending Top-Ups for Portfolio: ${portfolioId}`,
          initiated_by: initiatorId,
          source_table: 'angel_pool_investments',
          source_id: portfolioId,
          status: 'POSTED',
          approved_by: initiatorId,
          approval_timestamp: new Date()
        }
      });

      // Double-Entry Merge
      const pendingAccountId = `PORTFOLIO_PENDING_TOPUPS_${portfolioId}`;
      const principalAccountId = `PORTFOLIO_PRINCIPAL_${portfolioId}`;

      // Leg 1: Debit PORTFOLIO_PENDING_TOPUPS
      await tx.generalLedger.create({
        data: {
          transaction_id: mergeTx.id,
          account_id: pendingAccountId,
          account_type: 'liability',
          entry_type: 'debit',
          amount: totalAmount,
          category: 'partner_funding',
          description: `Debit Pending TopUps on Merge`,
          linked_party: initiatorId,
          source_id: portfolioId,
          source_table: 'angel_pool_investments',
          scope: 'platform',
        }
      });

      // Leg 2: Credit PORTFOLIO_PRINCIPAL
      await tx.generalLedger.create({
        data: {
          transaction_id: mergeTx.id,
          account_id: principalAccountId,
          account_type: 'equity',
          entry_type: 'credit',
          amount: totalAmount,
          category: 'partner_funding',
          description: `Credit Portfolio Principal`,
          linked_party: initiatorId,
          source_id: portfolioId,
          source_table: 'angel_pool_investments',
          scope: 'platform',
        }
      });

      // Update the sources to 'POSTED' so they aren't merged again
      await tx.ledgerTransactions.updateMany({
        where: { id: { in: txIds } },
        data: { 
          status: 'POSTED',
          transaction_group_id: mergeTx.id
        }
      });

      return { status: 'merged', transaction: mergeTx, total_amount: totalAmount };
    });
  }
}

export const cfoService = new CfoService();
