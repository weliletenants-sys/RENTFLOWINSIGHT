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
      const { phone, fullName, password, role } = req.body;

      const newUser = await this.service.registerNative(phone, fullName, password, role);

      return sendSuccess(res, { id: newUser.id }, 'Profile formally registered. Please login.', 201);
    } catch (error: any) {
      if (error.message.includes('Conflict')) {
        return sendError(res, error.message, 409);
      } else {
        return sendError(res, 'Internal server error processing registration.', 500);
      }
    }
  };

  /**
   * Endpoint: POST /auth/migrate-to-supabase
   */
  public migrateToSupabase = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return sendError(res, 'Phone and password are required', 400);
      }

      const result = await this.service.migrateToSupabase(phone, password);
      
      return sendSuccess(res, result, 'Successfully migrated to Supabase');
    } catch (error: any) {
      if (error.message.includes('Invalid') || error.message.includes('frozen')) {
        return sendError(res, error.message, 401);
      } else {
        console.error('[AuthController] migrateToSupabase error:', error);
        return sendError(res, 'Internal Server Error processing migration.', 500);
      }
    }
  };
}

export const authController = new AuthController();
