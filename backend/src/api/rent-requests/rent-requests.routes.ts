import { Router } from 'express';
import { createRequest, getMyRequests, getAllRequests, updateStatus } from '../../controllers/rent-requests.controller';
import { ensureUserAuthenticated, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', ensureUserAuthenticated, rolesGuard(['TENANT']), createRequest);
router.get('/me', ensureUserAuthenticated, rolesGuard(['TENANT']), getMyRequests);
router.get('/', ensureUserAuthenticated, rolesGuard(['AGENT', 'SUPPORTER']), getAllRequests);
router.patch('/:id/status', ensureUserAuthenticated, rolesGuard(['AGENT']), updateStatus);

export default router;
