import { Router } from 'express';
import { createRequest, getMyRequests, getAllRequests, updateStatus, approveRentRequest, disburseRentToLandlord } from '../../controllers/rent-requests.controller';
import { ensureUserAuthenticated, rolesGuard } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validation.middleware';
import { createRentRequestSchema, updateRentRequestStatusSchema } from './rent-requests.schemas';

const router = Router();

router.post('/', ensureUserAuthenticated, rolesGuard(['TENANT']), validateSchema(createRentRequestSchema), createRequest);
router.get('/me', ensureUserAuthenticated, rolesGuard(['TENANT']), getMyRequests);
router.get('/', ensureUserAuthenticated, rolesGuard(['AGENT', 'SUPPORTER']), getAllRequests);
router.patch('/:id/status', ensureUserAuthenticated, rolesGuard(['AGENT']), validateSchema(updateRentRequestStatusSchema), updateStatus);

// Core Processing
router.post('/:id/approve', ensureUserAuthenticated, rolesGuard(['MANAGER', 'FINANCE', 'AGENT']), approveRentRequest);
router.post('/:id/disburse', ensureUserAuthenticated, rolesGuard(['FINANCE']), disburseRentToLandlord);

export default router;
