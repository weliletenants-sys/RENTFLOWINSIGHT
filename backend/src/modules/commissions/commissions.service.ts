import { PaymentsService } from '../payments/payments.service';
import { COMMISSION_CONFIG } from '../../config/commission.config';

const FUND_POOL_ID = 'system-fund-pool'; // Source of cleared funds

export interface CommissionInput {
    repaymentId: string;
    agentId: string;
    tenantId: string;
    repaymentAmount: number;
}

export class CommissionsService {
    private paymentsService = new PaymentsService();

    /**
     * Executes asynchronous distribution of Agent Commissions mathematically derived
     * strictly inside independent infrastructure pipelines.
     */
    async distributeAgentCommission(input: CommissionInput) {
        // 1. Math Boundaries
        const commission = Math.floor(input.repaymentAmount * COMMISSION_CONFIG.DEFAULT_RATE);

        // 2. Strict Invariants
        if (commission >= input.repaymentAmount) {
            throw new Error('Invalid commission configuration: Commission physically cannot exceed origin bounds.');
        }

        if (commission <= 0) {
            console.log(`[COMMISSION] Bypassed execution for ${input.repaymentId} - Resulting amount ${commission} is unpayable.`);
            return null;
        }

        // 3. Independent Payment Execution Pipeline
        console.log(`[COMMISSION] Distributing ${commission} to Agent ${input.agentId} for Repayment ${input.repaymentId}`);
        return this.paymentsService.execute({
            debitAccountId: FUND_POOL_ID,
            creditAccountId: input.agentId,
            amount: commission,
            idempotencyKey: `comm_${input.repaymentId}`,
            metadata: {
                type: 'agent_commission',
                repayment_id: input.repaymentId,
                tenant_id: input.tenantId,
                paid_by: 'system' // Emitted mechanically
            },
            afterLedgerWrite: async (tx, transactionId, paymentId) => {
                // 4. Record Pure Business Entity
                await tx.commissions.create({
                    data: {
                        agent_id: input.agentId,
                        tenant_id: input.tenantId,
                        repayment_id: input.repaymentId,
                        amount: commission,
                        rate: COMMISSION_CONFIG.DEFAULT_RATE,
                        ledger_transaction_id: transactionId
                    }
                });
            }
        });
    }
}
