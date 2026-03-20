import { Router } from 'express';
import ceoRoutes from './ceo.routes';

import ctoRoutes from './cto.routes';

import crmRoutes from './crm.routes';

const router = Router();

// Mount Executive Hub sub-routes
router.use('/ceo', ceoRoutes);
router.use('/cto', ctoRoutes);
router.use('/crm', crmRoutes);

export default router;
