import { PaymentsService } from '../payments/payments.service';

const FUND_POOL_ID = 'system-fund-pool'; // System macro wallet explicitly bounding incoming tenant debt clearance

export interface TenantRepaymentInput {
    tenantId: string;
    amount: number;
    idempotencyKey: string;
    rentRequestId?: string;
}

export interface AgentRepaymentInput {
    agentId: string;
    tenantId: string;
    amount: number;
    idempotencyKey: string;
    rentRequestId?: string;
}

export class RepaymentsService {
    private paymentsService = new PaymentsService();

    /**
     * Tenant explicitly pays rent through standard channels natively dropping into the Fund Pool.
     */
    async repayByTenant(input: TenantRepaymentInput) {
        return this.paymentsService.execute({
            debitAccountId: input.tenantId,
            creditAccountId: FUND_POOL_ID,
            amount: input.amount,
            idempotencyKey: input.idempotencyKey,
            metadata: {
                type: 'tenant_repayment',
                tenant_id: input.tenantId,
                paid_by: input.tenantId,
                rent_request_id: input.rentRequestId,
            },
            afterLedgerWrite: async (tx, transactionId, paymentId) => {
                await tx.repayments.create({
                    data: {
                        tenant_id: input.tenantId,
                        paid_by_account_id: input.tenantId,
                        amount: input.amount,
                        ledger_transaction_id: transactionId,
                        payment_id: paymentId,
                        payment_method: 'WALLET',
                        rent_request_id: input.rentRequestId || null
                    }
                });
            }
        });
    }

    /**
     * Agent steps in handling the financial bound strictly linking the debt graph correctly to the Tenant.
     */
    async repayByAgent(input: AgentRepaymentInput) {
        return this.paymentsService.execute({
            debitAccountId: input.agentId,
            creditAccountId: FUND_POOL_ID,
            amount: input.amount,
            idempotencyKey: input.idempotencyKey,
            metadata: {
                type: 'agent_repayment',
                tenant_id: input.tenantId,
                paid_by: input.agentId,
                rent_request_id: input.rentRequestId,
            },
            afterLedgerWrite: async (tx, transactionId, paymentId) => {
                await tx.repayments.create({
                    data: {
                        tenant_id: input.tenantId,
                        paid_by_account_id: input.agentId,
                        amount: input.amount,
                        ledger_transaction_id: transactionId,
                        payment_id: paymentId,
                        payment_method: 'WALLET',
                        rent_request_id: input.rentRequestId || null
                    }
                });
            }
        });
    }
}
