import { Router } from 'express';
import {
  startApplication, saveStep1, saveStep2, saveStep3, saveStep4, getApplication,
  startAgentKyc, saveAgentKycStep1, saveAgentKycStep2, saveAgentKycStep3, getAgentApplication
} from '../../controllers/applications.controller';

const router = Router();

router.post('/', startApplication);
router.put('/:id/steps/1', saveStep1);
router.put('/:id/steps/2', saveStep2);
router.put('/:id/steps/3', saveStep3);
router.put('/:id/steps/4', saveStep4);
router.get('/:id', getApplication);

router.post('/agent', startAgentKyc);
router.put('/agent/:id/kyc-step1', saveAgentKycStep1);
router.put('/agent/:id/kyc-step2', saveAgentKycStep2);
router.put('/agent/:id/kyc-step3', saveAgentKycStep3);
router.get('/agent/:id', getAgentApplication);

export default router;
