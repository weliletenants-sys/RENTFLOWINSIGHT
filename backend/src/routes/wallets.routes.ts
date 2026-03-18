
import { Router } from 'express';
import { getMyWallet, deposit, withdraw, transfer, requestDeposit } from '../controllers/wallets.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

router.get('/my-wallet', authGuard, getMyWallet);
router.post('/deposit', authGuard, deposit);
router.post('/request-deposit', authGuard, requestDeposit);
router.post('/withdraw', authGuard, withdraw);
router.post('/transfer', authGuard, transfer);

export default router;
