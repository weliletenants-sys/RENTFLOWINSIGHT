import { Router } from 'express';
import { createRequest, getMyRequests, getAllRequests, updateStatus } from '../../controllers/rent-requests.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authGuard, rolesGuard(['TENANT']), createRequest);
router.get('/me', authGuard, rolesGuard(['TENANT']), getMyRequests);
router.get('/', authGuard, rolesGuard(['AGENT', 'SUPPORTER']), getAllRequests);
router.patch('/:id/status', authGuard, rolesGuard(['AGENT']), updateStatus);

export default router;
