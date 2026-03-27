import { Router } from 'express';
import { getLandlordSubscriptions, createSubscription } from './welile-homes.controller';
import { getTenantGamificationDashboard, depositTenantSavings } from './tenant-gamification.controller';

const router = Router();

// Landlord Subscriptions
router.get('/:landlord_id/subscriptions', getLandlordSubscriptions);
router.post('/:landlord_id/subscriptions', createSubscription);

// Tenant Gamification (OpenAPI 3.1 specified)
router.get('/tenant/:tenant_id/dashboard', getTenantGamificationDashboard);
router.post('/tenant/:tenant_id/deposit', depositTenantSavings);

export default router;
