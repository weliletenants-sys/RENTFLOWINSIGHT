import { Router } from 'express';
import { getMyWallet } from '../controllers/wallets.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authGuard, getMyWallet);

export default router;
