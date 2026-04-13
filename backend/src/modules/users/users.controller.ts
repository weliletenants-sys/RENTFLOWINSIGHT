import { Request, Response } from 'express';
import { UsersService } from './users.service';

export class UsersController {
  private service = new UsersService();

  /**
   * Endpoint: GET /users/me
   */
  public getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const profile = await this.service.getMyProfile(userId);
      res.status(200).json({ data: profile });
    } catch (error: any) {
      if (error.message.includes('suspended')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(404).json({ error: 'Profile not found.' });
      }
    }
  };

  /**
   * Endpoint: PATCH /users/me
   */
  public patchMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { full_name } = req.body;
      const updated = await this.service.updateProfile(userId, { full_name });
      res.status(200).json({ message: 'Profile updated successfully', data: updated });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update string' });
    }
  };
}

export const usersController = new UsersController();
