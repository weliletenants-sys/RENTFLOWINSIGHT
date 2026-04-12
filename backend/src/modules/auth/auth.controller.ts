import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  private service = new AuthService();

  /**
   * Endpoint: POST /auth/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        res.status(400).json({ error: 'Phone and password are required' });
        return;
      }

      const result = await this.service.loginDevice(phone, password);
      
      res.status(200).json({
        message: 'Successfully authenticated natively',
        data: result
      });
    } catch (error: any) {
      if (error.message.includes('Invalid') || error.message.includes('frozen')) {
        // Return 401 Unauthorized for bad credentials safely masking exact reason generally
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error processing authentication.' });
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

      res.status(201).json({
        message: 'Profile formally registered. Please login.',
        data: { id: newUser.id }
      });
    } catch (error: any) {
      if (error.message.includes('Conflict')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error processing registration.' });
      }
    }
  };
}

export const authController = new AuthController();
