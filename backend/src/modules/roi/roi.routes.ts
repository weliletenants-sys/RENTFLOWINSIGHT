import { Router } from 'express';
import { roiController } from './roi.controller';

const router = Router();

// POST /roi/run-cycle
router.post('/run-cycle', roiController.runCycle);

export default router;
