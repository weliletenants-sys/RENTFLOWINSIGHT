export type RiskInput = {
    eventId: string;
    userId: string;
    action: 'rent.request' | 'ledger.transfer';
    amount?: number;
    metadata?: any;
    idempotencyKey?: string;
};

export type RiskResult = {
    decision: 'ALLOW' | 'BLOCK' | 'REVIEW';
    score: number;
    reasons: string[];
    rule_version: string;
};
