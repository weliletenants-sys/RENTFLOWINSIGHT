import { Router } from 'express';
import { getProducts, createCheckoutSession } from './marketplace.controller';
import { authGuard } from '../../middlewares/auth.middleware';

const router = Router();

// /api/v1/marketplace/products
router.get('/products', getProducts);

// /api/v1/marketplace/orders
router.post('/orders', authGuard, createCheckoutSession);

export default router;
