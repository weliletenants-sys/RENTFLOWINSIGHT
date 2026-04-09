import { Router } from 'express';
import { getAgentOpsOverview, adjustAgentFloatLimit } from '../../controllers/ops.agent.controller';

const router = Router();

router.get('/overview', getAgentOpsOverview);
router.post('/float-limit', adjustAgentFloatLimit);

export default router;
