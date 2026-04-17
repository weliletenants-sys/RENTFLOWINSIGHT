import { Worker, Job } from 'bullmq';
import getRedisClient from '../config/redis.client';
import prisma from '../prisma/prisma.client';
import { AsyncLedgerJobPayload } from '../queues/ledger.queue';
import { v4 as uuidv4 } from 'uuid';

export const ledgerWorker = new Worker('LedgerTransactionsQueue', async (job: Job<AsyncLedgerJobPayload>) => {
   const payload = job.data;
   const { idempotencyKey, fromAccountId, toAccountId, amount, category, description, sourceTable, sourceId, actor } = payload;
   const redis = getRedisClient();

   // 1. Strict Ownership Token
   const workerLockToken = uuidv4();

   // 2. Strict Ordering via Mutex: Requeue instead of Spinlock to avoid hot-loop Redis Contention
   const walletMutexKey = `mutex:wallet:${fromAccountId}`;
   const lockAcquired = await redis.set(walletMutexKey, workerLockToken, 'NX', 'PX', 30000) === 'OK';
   
   if (!lockAcquired) {
       // Throws to natively trigger BullMQ exponential backoff without burning active CPU loop polling
       throw new Error('MUTEX_CONTENTION_DELAY'); 
   }

   // Start processing scope
   try {
       await prisma.$transaction(async (tx) => {
          // 1. Strict Database Idempotency Lock
          let finTx = await tx.financialTransactions.findUnique({ where: { idempotency_key: idempotencyKey }});
          if (finTx) {
             if (finTx.status === 'COMPLETED') return; // Safe duplicate fast-exit
             if (finTx.status === 'FAILED') throw new Error('Cannot restart permanently failed transaction.');
          }

          // Generate physical shell
          const financialTxId = uuidv4();
          
          if (!finTx) {
              finTx = await tx.financialTransactions.create({
                 data: {
                     id: financialTxId,
                     idempotency_key: idempotencyKey,
                     status: 'PENDING',
                     reference: category || 'UNKNOWN',
                     metadata: {
                         category, source_table: sourceTable, source_id: sourceId, amount
                     }
                 }
              });
          }

          // 2. Load Sender Source Account Native Balance (DB ROW-LEVEL LOCK FOR UPDATE to block concurrency mathematically)
          const sourceAccountRaw: any[] = await tx.$queryRaw`SELECT * FROM financial_accounts WHERE id = ${fromAccountId} LIMIT 1 FOR UPDATE`;
          const sourceAccount = sourceAccountRaw[0];
          if (!sourceAccount) throw new Error(`Source Account missing: ${fromAccountId}`);

          // 3. Dynamic Balance Verification strictly inside execution phase (Not API phase)
          // Wallets cannot go negative. (System accounts can mathematically handle dynamic variance).
          if (sourceAccount.type === 'WALLET') {
              // Realtime summation required to prevent race conditions vs caching
              const creditsAgg = await tx.financialEntries.aggregate({
                  where: { account_id: fromAccountId, type: 'CREDIT' },
                  _sum: { amount: true }
              });
              const debitsAgg = await tx.financialEntries.aggregate({
                  where: { account_id: fromAccountId, type: 'DEBIT' },
                  _sum: { amount: true }
              });
              
              const physicalBalance = (creditsAgg._sum.amount || 0) - (debitsAgg._sum.amount || 0);

              if (physicalBalance < amount) {
                  // Explicit failure routing
                  await tx.financialTransactions.update({
                      where: { id: finTx.id },
                      data: { status: 'FAILED', metadata: Object.assign({}, finTx.metadata as any, { error: 'INSUFFICIENT_FUNDS', physicalBalance }) }
                  });
                  throw new Error(`INSUFFICIENT_FUNDS_NATIVE_BLOCK`);
              }
          }

          // 4. Resolve System Destination Account Generation (Lazy)
          let targetAccount = await tx.financialAccounts.findUnique({ where: { id: toAccountId }});
          if (!targetAccount) {
              if (toAccountId.startsWith('SYS_PLATFORM_') || toAccountId.startsWith('REV_') || toAccountId.startsWith('EXP_')) {
                  targetAccount = await tx.financialAccounts.create({
                      data: { id: toAccountId, type: 'SYSTEM', currency: 'UGX' }
                  });
              } else {
                  throw new Error(`Invalid destination account mapping rules: ${toAccountId}`);
              }
          }

          // 5. Atomic Double-Entry Flush!
          await tx.financialEntries.create({
              data: { transaction_id: finTx.id, account_id: sourceAccount.id, amount, type: 'DEBIT' }
          });

          await tx.financialEntries.create({
              data: { transaction_id: finTx.id, account_id: targetAccount.id, amount, type: 'CREDIT' }
          });

          // 6. Complete
          await tx.financialTransactions.update({
             where: { id: finTx.id },
             data: { status: 'COMPLETED' }
          });
       });
       
       // Success -> Publish to redis user channel! 
       // If the transaction originates/targets a user, notify them!
       const getUserId = async (id: string) => {
           const ac = await prisma.financialAccounts.findUnique({ where: { id }});
           return ac?.user_id;
       };
       const uid1 = await getUserId(fromAccountId);
       const uid2 = await getUserId(toAccountId);
       
       const eventPayload = JSON.stringify({ 
           type: 'TRANSACTION_SUCCESS', 
           event_id: uuidv4(), // SSE Idempotency versioning
           transaction_id: financialTxId,
           payload: { category, amount, status: 'COMPLETED' }
       });

       if (uid1) redis.publish(`user:${uid1}`, eventPayload);
       if (uid2 && uid1 !== uid2) redis.publish(`user:${uid2}`, eventPayload);

   } catch (error: any) {
        if (error.code === 'P2002') return; // Safe ignore constraint re-fires inside BullMQ
        if (error.message === 'MUTEX_CONTENTION_DELAY') throw error; // Fast pass-through for backoff
        
        // Throw natively to ensure BullMQ correctly registers the retry failure metrics.
        throw error;
   } finally {
       // 3. Exact Ownership Release
       // Lua script guarantees atomic GET and DEL to prevent accidental unlocks of slow transactions
       const luaScript = `
           if redis.call("get",KEYS[1]) == ARGV[1]
           then
               return redis.call("del",KEYS[1])
           else
               return 0
           end
       `;
       await redis.eval(luaScript, 1, walletMutexKey, workerLockToken);
   }
}, {
   connection: getRedisClient(),
   concurrency: 50, // Hard 50 Worker Pool
});

// Explicit DLQ Tracker Mechanism
ledgerWorker.on('failed', async (job: Job | undefined, err: Error) => {
   if (!job) return;
   if (job.attemptsMade === job.opts.attempts) {
        // Job exhausted all logical retries -- Enter native DLQ
        console.error(`🚨 [DLQ Triggered] Ledger transaction completely failed for Job: ${job.id}. Reason: ${err.message}`);
        // We log to actual postgreSQL for persistent manual reconciliation!
        try {
            await prisma.notifications.create({
               data: {
                   account_id: 'SYSTEM', // Sent to Admins conceptually
                   title: 'DLQ: Failed Ledger Execution',
                   message: `Idempotency ${job.id} failed repeatedly. Immediate CFO resolution required.`,
                   type: 'CRITICAL_ALERT',
                   is_read: false
               }
            });
        } catch(e) {}
   }
});

console.log('[Ledger Worker] Spin-up completed. Actively accepting BullMQ pipelines.');
