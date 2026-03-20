import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
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

export default router;
