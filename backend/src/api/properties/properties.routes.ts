import { Router } from 'express';
import { listProperty, checkChainHealth } from './properties.controller';

const router = Router();

// Endpoint for Agents to map Landlords to Properties natively
router.post('/', listProperty);

// Extrapolates Agent -> Landlord -> Property linkage compliance
router.get('/:id/chain-health', checkChainHealth);

export default router;
