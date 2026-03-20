import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../../controllers/notification.controller';
import { authGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authGuard, getNotifications);
router.patch('/read-all', authGuard, markAllAsRead);
router.patch('/:id/read', authGuard, markAsRead);

export default router;
