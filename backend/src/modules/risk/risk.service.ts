import prisma from '../../prisma/prisma.client';
import { evaluateRules } from './risk.rules';
import { RiskInput, RiskResult } from './risk.types';

export class RiskService {
    /**
     * Executes deterministically ensuring isolated evaluations never replay.
     * Guaranteed fail-closed intercept dropping native logs.
     */
    async evaluate(input: RiskInput): Promise<RiskResult> {
        // Enforce transactional safety: Evaluation && Logging occurs together.
        // This solves the 'crashed before logging' race condition.
        return prisma.$transaction(async (tx) => {
            // 1. Guard Idempotency natively inside the transaction bounds
            const existingEvaluation = await tx.riskLog.findUnique({
                where: { event_id: input.eventId }
            });

            if (existingEvaluation) {
                return {
                    decision: existingEvaluation.decision as 'ALLOW'|'BLOCK'|'REVIEW',
                    score: existingEvaluation.score,
                    reasons: existingEvaluation.reasons
                };
            }

            // 2. Perform Physical Evaluation safely isolated using the transaction context
            let result: RiskResult;
            try {
                result = await evaluateRules(tx, input);
            } catch (error) {
                console.error(`[RISK FAILURE] Rules Engine crashed dynamically evaluating ${input.eventId}`, error);
                throw new Error('Risk engine failure'); // Forces safe callback retry. FAIL CLOSED.
            }

            const { decision, score, reasons, rule_version } = result;

            // 2.5 Dynamic metadata payload enhancement
            const enrichedMetadata = {
                 ...input.metadata,
                 ...(decision === 'BLOCK' ? {
                     rule_triggered: reasons[0] || 'UNKNOWN_RULE', // Grabs primary
                     score,
                     decision_reason: reasons.join(', ')
                 } : {})
            };

            // 3. Store truth permanently mapping execution logs safely
            await tx.riskLog.create({
                data: {
                    event_id: input.eventId,
                    idempotency_key: input.idempotencyKey || null,
                    user_id: input.userId,
                    action: input.action,
                    amount: input.amount,
                    score,
                    decision,
                    rule_version,
                    reasons,
                    metadata: enrichedMetadata
                }
            });

            // 4. Also instantiate the explicit RiskReview state machine row if needed
            if (decision === 'REVIEW') {
               await tx.riskReview.create({
                   data: {
                       event_id: input.eventId,
                       idempotency_key: input.idempotencyKey || null,
                       user_id: input.userId,
                       action: input.action,
                       amount: input.amount,
                       status: 'PENDING',
                       reasons
                   }
               });
            }

            return result;
        });
    }
}
