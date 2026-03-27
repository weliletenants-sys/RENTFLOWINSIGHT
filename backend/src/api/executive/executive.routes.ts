import { Router } from 'express';
import ceoRoutes from './ceo.routes';

import ctoRoutes from './cto.routes';

import crmRoutes from './crm.routes';
import cmoRoutes from './cmo.routes';

const router = Router();

// Mount Executive Hub sub-routes
router.use('/ceo', ceoRoutes);
router.use('/cto', ctoRoutes);
router.use('/crm', crmRoutes);
router.use('/cmo', cmoRoutes);

export default router;
