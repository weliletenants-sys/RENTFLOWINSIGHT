import { Request, Response } from 'express';
import { AdminAuthService } from './adminAuth.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

export class AdminAuthController {
  private service = new AdminAuthService();

  /**
   * Endpoint: POST /admin/auth/login
   */
  public adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return sendError(res, 'Phone and password are required', 400);
      }

      const result = await this.service.loginAdminContext(phone, password);
      
      return sendSuccess(res, result, 'Admin securely authenticated');
    } catch (error: any) {
      if (error.message.includes('Invalid') || error.message.includes('frozen') || error.message.includes('Unauthorized')) {
        return sendError(res, error.message, 401);
      } else {
        return sendError(res, 'Internal Server Error processing administrative login.', 500);
      }
    }
  };

  /**
   * Endpoint: POST /admin/auth/logout
   */
  public adminLogout = async (req: Request, res: Response): Promise<void> => {
    // Standard stateless logout mechanism relies on frontend dropping token natively,
    // but this serves as a verified hook for future session invalidation.
    return sendSuccess(res, null, 'Successfully logged out securely', 200);
  };
}

export const adminAuthController = new AdminAuthController();
