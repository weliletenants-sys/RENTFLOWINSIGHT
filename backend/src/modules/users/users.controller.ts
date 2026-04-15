import { Request, Response } from 'express';
import { UsersService } from './users.service';

export class UsersController {
  private service = new UsersService();

  /**
   * GET /api/v2/users/me
   *
   * Silent Migration Entry Point — called on every authenticated page load.
   * - Existing users: returns their profile (zero overhead, single DB read)
   * - New users: silently seeds a profile record and returns it
   *
   * The `X-Migrated` response header is set to `true` on first seed —
   * useful for observability dashboards, never exposed to the frontend UI.
   */
  public getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Identity not resolved — check auth middleware.' });
        return;
      }

      // Forward identity claims for silent migration seeding
      const claims = {
        email: req.user?.email,
        phone: req.user?.phone,
      };

      const { profile, migrated } = await this.service.getMyProfile(userId, claims);

      // Observable migration signal — backend only, not exposed to user
      if (migrated) {
        res.setHeader('X-Migrated', 'true');
      }

      res.status(200).json({ data: profile });
    } catch (error: any) {
      if (error.message.includes('suspended')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to resolve profile.' });
      }
    }
  };

  /**
   * PATCH /api/v2/users/me
   */
  public patchMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Identity not resolved.' });
        return;
      }
      const { full_name } = req.body;
      const updated = await this.service.updateProfile(userId, { full_name });
      res.status(200).json({ message: 'Profile updated successfully', data: updated });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile.' });
    }
  };
}

export const usersController = new UsersController();

