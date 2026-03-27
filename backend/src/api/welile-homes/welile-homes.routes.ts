import { Router } from 'express';
import { getLandlordSubscriptions, createSubscription } from './welile-homes.controller';

const router = Router();

// Retrieve all subscriptions linked to a specific Landlord ID
router.get('/:landlord_id/subscriptions', getLandlordSubscriptions);

// Create a new property pooling subscription 
router.post('/:landlord_id/subscriptions', createSubscription);

export default router;
