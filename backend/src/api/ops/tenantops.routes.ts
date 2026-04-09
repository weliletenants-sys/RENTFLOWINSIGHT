import { Router } from 'express';
import { getTenantOpsOverview, manualCollectRent } from '../../controllers/ops.tenant.controller';

const router = Router();

router.get('/overview', getTenantOpsOverview);
router.post('/manual-collect', manualCollectRent);

export default router;
