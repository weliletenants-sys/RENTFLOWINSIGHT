import { Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';
import { problemResponse } from '../../utils/problem';

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

     const userWallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
     if (!userWallet) {
       return problemResponse(res, 404, 'Wallet Missing', 'Your Triple-State wallet has not been registered.', 'wallet-missing');
     }

     // Calculate transaction values outside the atomic lock to prevent DB thrashing
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

     if (userWallet.balance < totalCartValue) {
        return problemResponse(res, 422, 'Insufficient Funds', `Your checkout requires UGX ${totalCartValue.toLocaleString()} but your balance is UGX ${userWallet.balance.toLocaleString()}.`, 'insufficient-funds');
     }

     // ----------------------------------------------------
     // execute atomic cross-ledger Checkout
     // ----------------------------------------------------
     const executedOrder = await prisma.$transaction(async (tx) => {
         // Deduct from wallet
         const updatedWallet = await tx.wallets.update({
             where: { id: userWallet.id },
             data: { balance: { decrement: totalCartValue } }
         });

         const timestamp = new Date().toISOString();

         // Log Wallet transaction
         await tx.walletTransactions.create({
             data: {
                amount: -totalCartValue,
                balance_before: userWallet.balance,
                balance_after: updatedWallet.balance,
                created_at: timestamp,
                description: `Marketplace Order Fulfillment.`,
                sender_id: userId,
                status: 'COMPLETED'
             }
         });

         // Record General Ledger (Debiting system logic)
         await tx.generalLedger.create({
             data: {
                amount: totalCartValue,
                category: 'marketplace_purchase',
                created_at: timestamp,
                direction: 'DEBIT',
                source_table: 'wallets',
                source_id: userWallet.id,
                transaction_date: timestamp,
                user_id: userId
             }
         });

         // Assuming ProductOrders handles standard tracking. (We bypass multi-line OrderItems insertion because schema omitted it, relying solely on ProductOrders root tracking per schema.prisma limits, or we create multiple ProductOrders if multi-cart).
         // Given ProductOrders takes unit_price, we will create one ProductOrder per item linearly for architectural simplicity given schema constraints.
         
         const orderBatch = itemsMapped.map((i) => ({
             agent_commission: 0, // Could be computed if an agent referred
             created_at: timestamp,
             quantity: i.qty,
             status: 'paid_pending_fulfillment',
             total_price: i.runningItemSum,
             unit_price: i.product.price,
             user_id: userId,
             product_id: i.product.id
         }));

         await tx.productOrders.createMany({ data: orderBatch });

         // Deduct Stock
         for (const i of itemsMapped) {
             await tx.products.update({
                 where: { id: i.product.id },
                 data: { stock: { decrement: i.qty } }
             });
         }

         return orderBatch;
     });

     return res.status(200).json({
         success: true,
         message: 'Order executed systematically.',
         items: executedOrder.length
     });

   } catch (error: any) {
     console.error('[Marketplace Execution Lock Error]', error.message);
     
     // Catch custom throws like missing products
     if (error.message.includes('not found') || error.message.includes('Insufficient stock')) {
         return problemResponse(res, 400, 'Invalid Cart State', error.message, 'cart-validation-failed');
     }

     return problemResponse(res, 500, 'Atomic Engine Failure', 'Backend transaction aborted natively to prevent corrupt state.', 'transaction-aborted');
   }
};
