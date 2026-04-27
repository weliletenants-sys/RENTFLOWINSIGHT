import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

export class AuthController {
  private service = new AuthService();

  /**
   * Endpoint: POST /auth/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return sendError(res, 'Phone and password are required', 400);
      }

      const result = await this.service.loginDevice(phone, password);
      
      return sendSuccess(res, result, 'Successfully authenticated natively');
    } catch (error: any) {
      if (error.message.includes('Invalid') || error.message.includes('frozen')) {
        return sendError(res, error.message, 401);
      } else {
        return sendError(res, 'Internal Server Error processing authentication.', 500);
      }
    }
  };

  /**
   * Endpoint: POST /auth/register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, fullName, password, role, nationalId, referrerId } = req.body;

      const newUser = await this.service.registerNative(phone, fullName, password, role, nationalId, referrerId);

      return sendSuccess(res, { id: newUser.user.id, token: newUser.access_token }, 'Profile formally registered. Please login.', 201);
    } catch (error: any) {
      if (error.message.includes('Conflict')) {
        return sendError(res, error.message, 409);
      } else {
        return sendError(res, 'Internal server error processing registration.', 500);
      }
    }
  };

  /**
   * Endpoint: POST /auth/request-otp
   */
  public requestOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.body;
      const result = await this.service.requestOtp(phone);
      return sendSuccess(res, result, 'OTP Requested');
    } catch (error: any) {
      return sendError(res, error.message || 'Error requesting OTP', 400);
    }
  };

  /**
   * Endpoint: POST /auth/verify-otp
   */
  public verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, otp } = req.body;
      const result = await this.service.verifyOtpAndLogin(phone, otp);
      return sendSuccess(res, result, 'Logged in successfully');
    } catch (error: any) {
      const status = error.message.includes('attempts') ? 429 : 400;
      return sendError(res, error.message || 'Error verifying OTP', status);
    }
  };
  /**
   * Endpoint: POST /auth/request-password-reset
   */
  public requestPasswordResetOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.body;
      const result = await this.service.requestPasswordResetOtp(phone);
      return sendSuccess(res, result, 'Reset OTP Requested');
    } catch (error: any) {
      return sendError(res, error.message || 'Error requesting reset OTP', 400);
    }
  };

  /**
   * Endpoint: POST /auth/reset-password
   */
  public resetPasswordWithOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, otp, newPassword } = req.body;
      const result = await this.service.resetPasswordWithOtp(phone, otp, newPassword);
      return sendSuccess(res, result, 'Password reset successfully');
    } catch (error: any) {
      const status = error.message.includes('attempts') ? 429 : 400;
      return sendError(res, error.message || 'Error resetting password', status);
    }
  };

  /**
   * Endpoint: POST /auth/admin-reset-password
   */
  public adminResetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, new_password } = req.body;
      const result = await this.service.adminResetPassword(user_id, new_password);
      return sendSuccess(res, result, 'Password reset by admin');
    } catch (error: any) {
      return sendError(res, error.message || 'Error resetting password', 500);
    }
  };

  /**
   * Endpoint: DELETE /auth/admin-delete-user
   */
  public adminDeleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id } = req.body;
      const result = await this.service.adminDeleteUser(user_id);
      return sendSuccess(res, result, 'User deleted');
    } catch (error: any) {
      return sendError(res, error.message || 'Error deleting user', 500);
    }
  };
}

export const authController = new AuthController();
