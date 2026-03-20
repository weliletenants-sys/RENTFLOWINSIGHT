import { Router } from 'express';
import { getOverviewMetrics } from '../../controllers/coo.controller';

const router = Router();

router.get('/metrics/overview', getOverviewMetrics);

export default router;
