import { Router } from 'express';
import { paymentsController } from './payments.controller';
// Assume an authMiddleware exists or import from shared/
// import { authGuard } from '../../shared/middleware/auth.middleware';

const router = Router();

// POST /payments/rent
// router.post('/rent', authGuard, paymentsController.payRent);
router.post('/rent', paymentsController.payRent);

export default router;
