import { Router } from 'express';
import { 
  getOverview, 
  getProperties, 
  registerProperty, 
  getTenants, 
  inviteTenant, 
  enrollWelileHomes, 
  getPaymentHistory 
} from '../../controllers/owner.controller';
import { ensureUserAuthenticated } from '../../middlewares/auth.middleware';

const router = Router();

router.use(ensureUserAuthenticated);

// Dashboard & Overview
router.get('/overview', getOverview);

// Properties
router.get('/properties', getProperties);
router.post('/properties', registerProperty);

// Tenants
router.get('/tenants', getTenants);
router.post('/tenants/invite', inviteTenant);
router.post('/tenants/welile-homes/enroll', enrollWelileHomes);

// Finances
router.get('/finance/history', getPaymentHistory);

export default router;
