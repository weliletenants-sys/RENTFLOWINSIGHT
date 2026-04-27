import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/request-password-reset', authController.requestPasswordResetOtp);
router.post('/reset-password', authController.resetPasswordWithOtp);
router.post('/admin-reset-password', authController.adminResetPassword);
router.delete('/admin-delete-user', authController.adminDeleteUser);

export default router;
