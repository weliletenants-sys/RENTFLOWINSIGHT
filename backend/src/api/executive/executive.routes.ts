import { Router } from 'express';
import ceoRoutes from './ceo.routes';

const router = Router();

// Mount Executive Hub sub-routes
router.use('/ceo', ceoRoutes);

// Placeholders for future Hub tabs
// router.use('/cto', ctoRoutes);
// router.use('/cmo', cmoRoutes);
// router.use('/crm', crmRoutes);

export default router;
