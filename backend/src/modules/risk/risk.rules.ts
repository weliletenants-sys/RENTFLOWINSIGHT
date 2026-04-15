import { PrismaClient, Prisma } from '@prisma/client';
import { RiskInput, RiskResult } from './risk.types';

// We allow either raw Prisma or Transaction client to ensure full atomicity
type PrismaTx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

const CURRENT_RULE_VERSION = '1.0';

export const evaluateRules = async (tx: PrismaTx | PrismaClient, input: RiskInput): Promise<RiskResult> => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Time-Bound Velocity Rule (5 minutes cap)
    // Avoid unbounded rules. Use exact Postgres native intervals to eliminate Timezone shift drift.
    const recentTx = await tx.$queryRaw`
        SELECT id FROM outbox_events 
        WHERE type = ${input.action} 
        AND payload->>'userId' = ${input.userId}
        AND created_at > NOW() - INTERVAL '5 minutes'
        LIMIT 6;
    ` as any[];

    if (recentTx.length > 5) {
        score += 40;
        reasons.push('High transaction velocity (>5 per 5 mins)');
    }

    // 2. Anomaly Amount Threshold 
    if (input.amount && input.amount > 1000000) {
        score += 30;
        reasons.push('Large transaction threshold exceeded (>1M)');
    }

    // Default Deterministic Gates
    if (score >= 70) {
        return { decision: 'BLOCK', score, reasons, rule_version: CURRENT_RULE_VERSION };
    }

    if (score >= 40) {
        return { decision: 'REVIEW', score, reasons, rule_version: CURRENT_RULE_VERSION };
    }

    return { decision: 'ALLOW', score, reasons, rule_version: CURRENT_RULE_VERSION };
};
