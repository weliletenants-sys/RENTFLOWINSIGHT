import { Router } from 'express';
import { getPartnerOpsOverview, approveProxyInvestment } from '../../controllers/ops.partner.controller';

const router = Router();

router.get('/overview', getPartnerOpsOverview);
router.post('/approve-proxy', approveProxyInvestment);

export default router;
