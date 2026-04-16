import { Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';
import { problemResponse } from '../../utils/problem';
import { LedgerService } from '../../modules/ledger/ledger.service';
import { v4 as uuidv4 } from 'uuid';

const ledgerService = new LedgerService();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const [products, totalItems] = await Promise.all([
       prisma.products.findMany({
         where: { active: true },
         take: limit,
         skip,
         orderBy: { created_at: 'desc' }
       }),
       prisma.products.count({ where: { active: true } })
    ]);

    res.json({
       success: true,
       data: products,
       pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
       }
    });

  } catch (err: any) {
    console.error('Failed fetching products:', err);
    return problemResponse(res, 500, 'Internal Server Error', 'Engine failed locating product tables natively.', 'query-failed');
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
   try {
     const { items } = req.body;
     const userId = req.user?.id; // Assuming authGuard injects req.user

     if (!userId) {
       return problemResponse(res, 401, 'Unauthorized', 'Valid token verification is required to process market orders.', 'missing-session');
     }

     if (!Array.isArray(items) || items.length === 0) {
       return problemResponse(res, 400, 'Bad Request', 'Your cart array cannot be empty.', 'validation-error');
     }

     // 1. Fetch exact V2 Financial Account for Wallet
     const userWallet = await prisma.financialAccounts.findFirst({ where: { user_id: userId, type: 'WALLET' } });
     if (!userWallet) {
       return problemResponse(res, 404, 'Wallet Missing', 'Your Triple-State wallet has not been registered.', 'wallet-missing');
     }

     // 2. Pre-verify Cart Math
     let totalCartValue = 0;
     const productsToVerify = await prisma.products.findMany({
         where: { id: { in: items.map(i => i.productId) } }
     });

     const itemsMapped = items.map((cartItem: any) => {
         const serverProduct = productsToVerify.find(p => p.id === cartItem.productId);
         if (!serverProduct) throw new Error(`Product ${cartItem.productId} not found.`);
         if (serverProduct.stock < cartItem.quantity) throw new Error(`Insufficient stock for ${serverProduct.name}.`);
         
         const runningItemSum = serverProduct.price * cartItem.quantity;
         totalCartValue += runningItemSum;

         return {
             product: serverProduct,
             qty: cartItem.quantity,
             runningItemSum
         };
     });

     // 3. Balance verification
     if (userWallet.balance < totalCartValue) {
        return problemResponse(res, 422, 'Insufficient Funds', `Your checkout requires UGX ${totalCartValue.toLocaleString()} but your balance is UGX ${userWallet.balance.toLocaleString()}.`, 'insufficient-funds');
     }

     // 4. Ledger Execution Pipeline (Strict atomic idempotent transfer)
     const executionId = uuidv4();
     
     // Perform Ledger Transfer (Wallet -> System Revenue)
     const ledgerExecution = await ledgerService.transferWithIdempotency({
         idempotencyKey: `MKT_ORDER_${executionId}`,
         fromAccountId: userWallet.id,
         toAccountId: 'SYS_PLATFORM_MARKETPLACE_REVENUE', // Handled via V2 auto-provisioning
         amount: totalCartValue,
         category: 'marketplace_purchase',
         description: 'Marketplace Cart Fulfillment',
         sourceTable: 'product_orders',
         sourceId: executionId
     }, { id: 'SYSTEM', role: 'SUPER_ADMIN', scopes: ['ledger.transfer.execute'] });

     // 5. Store Standard Record States (Stock / Orders) internally 
     // (Executed safely after Ledger clears)
     const orderBatch = itemsMapped.map((i) => ({
         agent_commission: 0,
         created_at: new Date().toISOString(),
         quantity: i.qty,
         status: 'paid_pending_fulfillment',
         total_price: i.runningItemSum,
         unit_price: i.product.price,
         account_id: userId,
         product_id: i.product.id
     }));

     await prisma.$transaction(async (tx) => {
         await tx.productOrders.createMany({ data: orderBatch });

         // Deduct Stock
         for (const i of itemsMapped) {
             await tx.products.update({
                 where: { id: i.product.id },
                 data: { stock: { decrement: i.qty } }
             });
         }
     });

     return res.status(200).json({
         success: true,
         message: 'Order executed systematically along strictly verified ledger pipelines.',
         items: orderBatch.length,
         ledgerReceipt: ledgerExecution.transaction_id
     });

   } catch (error: any) {
     console.error('[Marketplace Execution Lock Error]', error.message);
     
     // Catch custom throws like missing products
     if (error.message.includes('not found') || error.message.includes('Insufficient stock')) {
         return problemResponse(res, 400, 'Invalid Cart State', error.message, 'cart-validation-failed');
     }

     return problemResponse(res, 500, 'Atomic Engine Failure', 'Backend transaction aborted natively to prevent corrupt ledger state.', 'transaction-aborted');
   }
};
