import { Router } from 'express';
import { getCeoKpis, getGrowthMetrics, getCharts, getRentRequestsTable } from './ceo.controller';

const router = Router();

// In a real app, middleware like 'requireRole(["CEO", "SUPER_ADMIN"])' goes here.
// router.use(requireRole(['CEO', 'SUPER_ADMIN']));

router.get('/kpis', getCeoKpis);
router.get('/growth-metrics', getGrowthMetrics);
router.get('/charts', getCharts);
router.get('/rent-requests', getRentRequestsTable);
// router.get('/staff-performance', getStaffPerformance);

export default router;
