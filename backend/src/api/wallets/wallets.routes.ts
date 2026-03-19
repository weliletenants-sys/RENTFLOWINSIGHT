
import { Router } from 'express';
import { getMyWallet, deposit, withdraw, transfer, requestDeposit } from '../../controllers/wallets.controller';
import { authGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/my-wallet', authGuard, getMyWallet);
router.post('/deposits', authGuard, deposit);
router.post('/deposits/requests', authGuard, requestDeposit);
router.post('/withdrawals', authGuard, withdraw);
router.post('/transfers', authGuard, transfer);

export default router;
