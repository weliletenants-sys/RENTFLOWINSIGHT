import { EventDispatcher } from '../EventDispatcher';
import { RentPipelineService } from '../../modules/rent_pipeline/rent_pipeline.service';

export class PipelineListener {
    private service = new RentPipelineService();

    constructor() {
        this.register();
    }

    private register() {
        // Both Tenant and Agent payment structures implicitly represent formal Pipeline reductions natively
        EventDispatcher.on('tenant_repayment.created', this.handleRepayment.bind(this));
        EventDispatcher.on('agent_repayment.created', this.handleRepayment.bind(this));
    }

    /**
     * Identically captures Outbox JSON extracting the Rent Request keys safely.
     * Guaranteed safe because ID mapping ensures strict execution uniquely.
     */
    private async handleRepayment(payload: any) {
        try {
            console.log(`[LISTENER: Pipeline] Intercepted Repayment Event: ${payload.paymentId}`);
            
            if (!payload.rent_request_id) {
                console.log(`[LISTENER: Pipeline] Repayment ${payload.paymentId} skipped: No explicit rent_request_id bounds mapped.`);
                return;
            }

            const result = await this.service.applyDebtReduction(
                payload.rent_request_id,
                payload.amount,
                payload.paymentId
            );

            // Forward strictly executing 'REPAID' states back out to Dispatcher inherently linking ROI / Investors gracefully
            if (result && result.newStatus === 'REPAID') {
                console.log(`[LISTENER: Pipeline] Rent Request ${payload.rent_request_id} achieved total REPAID status mathematically. Emitting resolution event.`);
                EventDispatcher.emit('rent_request.repaid', {
                    rent_request_id: payload.rent_request_id,
                    tenant_id: result.tenantId, // Or payload.tenant_id
                    repayment_id: payload.paymentId
                });
            }

        } catch (error) {
            console.error(`[LISTENER: Pipeline] FATAL Runtime Error mapping State Pipeline deduction on payload ${payload.paymentId}:`, error);
        }
    }
}

// Bootstrap Singleton strictly isolated natively
export const pipelineListener = new PipelineListener();
