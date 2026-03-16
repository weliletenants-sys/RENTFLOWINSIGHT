
import { Router } from 'express';
import { getMyWallet, deposit, withdraw, transfer } from '../controllers/wallets.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authGuard, getMyWallet);
router.post('/deposit', authGuard, deposit);
router.post('/withdraw', authGuard, withdraw);
router.post('/transfer', authGuard, transfer);

export default router;
