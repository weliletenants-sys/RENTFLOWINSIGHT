import { Router } from 'express';
import {
  startApplication, saveStep1, saveStep2, saveStep3, saveStep4, getApplication,
  startAgentKyc, saveAgentKycStep1, saveAgentKycStep2, saveAgentKycStep3, getAgentApplication
} from '../../controllers/applications.controller';

const router = Router();

router.post('/start', startApplication);
router.put('/:id/step1', saveStep1);
router.put('/:id/step2', saveStep2);
router.put('/:id/step3', saveStep3);
router.put('/:id/step4', saveStep4);
router.get('/:id', getApplication);

router.post('/agent/start', startAgentKyc);
router.put('/agent/:id/kyc-step1', saveAgentKycStep1);
router.put('/agent/:id/kyc-step2', saveAgentKycStep2);
router.put('/agent/:id/kyc-step3', saveAgentKycStep3);
router.get('/agent/:id', getAgentApplication);

export default router;
