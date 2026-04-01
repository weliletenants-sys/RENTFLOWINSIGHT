import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import { AiIdController } from './ai-id.controller';
import { 
  getUserPersonas, 
  createPersonaRequisition, 
  getUserRequisitions,
  switchPersonaMode
} from '../../controllers/personas.controller';

const router = Router();

// All persona/context endpoints require authentication
router.use(authGuard);

router.get('/', getUserPersonas);
router.post('/requisitions', createPersonaRequisition);
router.get('/requisitions', getUserRequisitions);
router.post('/switch', switchPersonaMode);

// AI ID Profile Endpoints
router.get('/ai-id/me', AiIdController.getMyProfile);
router.get('/ai-id/:ai_id', AiIdController.getProfileById);

export default router;
