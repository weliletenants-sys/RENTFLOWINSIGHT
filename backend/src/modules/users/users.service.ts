import { UsersRepository } from './users.repository';

export class UsersService {
  private repository = new UsersRepository();

  /**
   * Retrieves the sanitized profile safely.
   */
  async getMyProfile(userId: string) {
    if (!userId) throw new Error('User ID required');
    const profile = await this.repository.getUserProfileSafe(userId);
    if (!profile) throw new Error('Profile not found.');
    if (profile.is_frozen) throw new Error('Account suspended.');

    return profile;
  }

  /**
   * Allows basic profile editing bounding inputs perfectly.
   */
  async updateProfile(userId: string, updates: { full_name?: string }) {
    if (!userId) throw new Error('User ID required');
    return this.repository.updateProfile(userId, updates);
  }
}
