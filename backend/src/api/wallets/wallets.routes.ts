import { Router } from 'express';
import { getMyWallet, deposit, withdraw, transfer, requestDeposit } from '../../controllers/wallets.controller';
import { ensureUserAuthenticated } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validation.middleware';
import { amountSchema, transferSchema, requestDepositSchema } from './wallets.schemas';

const router = Router();

router.get('/my-wallet', ensureUserAuthenticated, getMyWallet);
router.post('/deposits', ensureUserAuthenticated, validateSchema(amountSchema), deposit);
router.post('/deposits/requests', ensureUserAuthenticated, validateSchema(requestDepositSchema), requestDeposit);
router.post('/withdrawals', ensureUserAuthenticated, validateSchema(amountSchema), withdraw);
router.post('/transfers', ensureUserAuthenticated, validateSchema(transferSchema), transfer);

export default router;
