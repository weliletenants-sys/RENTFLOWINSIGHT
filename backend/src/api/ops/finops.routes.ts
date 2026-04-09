import { Router } from 'express';
import { getFinancialOpsPulse, verifyDepositTID } from '../../controllers/ops.finops.controller';

const router = Router();

router.get('/pulse', getFinancialOpsPulse);
router.post('/verify-tid', verifyDepositTID);

export default router;
