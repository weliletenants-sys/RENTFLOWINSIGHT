import { PrismaClient, Prisma } from '@prisma/client';

export async function withTransactionRetry<T>(
    prisma: PrismaClient,
    action: (tx: Prisma.TransactionClient) => Promise<T>,
    maxRetries: number = 3
): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await prisma.$transaction(async (tx) => {
                return await action(tx);
            }, {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Prevent phantom reads and serialize the locks natively
                maxWait: 5000, 
                timeout: 10000 
            });
        } catch (error: any) {
            const isDeadlock = error.code === 'P2034' || error.message?.includes('deadlock detected') || error.message?.includes('could not serialize access due to concurrent update');
            
            if (isDeadlock && attempt < maxRetries) {
                console.warn(`[DEADLOCK ALERT] Transaction deadlock detected on attempt ${attempt}. Retrying sequentially...`);
                // Introduce an exponential backoff jitter to break cyclical lock contentions gracefully
                await new Promise(resolve => setTimeout(resolve, attempt * 150)); 
                continue;
            }
            throw error;
        }
    }
    throw new Error('Transaction completely exhausted after max deadlock retries.');
}
