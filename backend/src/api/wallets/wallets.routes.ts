
import { Router } from 'express';
import { getMyWallet, deposit, withdraw, transfer, requestDeposit } from '../../controllers/wallets.controller';
import { ensureUserAuthenticated } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/my-wallet', ensureUserAuthenticated, getMyWallet);
router.post('/deposits', ensureUserAuthenticated, deposit);
router.post('/deposits/requests', ensureUserAuthenticated, requestDeposit);
router.post('/withdrawals', ensureUserAuthenticated, withdraw);
router.post('/transfers', ensureUserAuthenticated, transfer);

export default router;
