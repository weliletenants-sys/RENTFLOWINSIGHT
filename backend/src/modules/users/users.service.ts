import { UsersRepository } from './users.repository';

export class UsersService {
  private repository = new UsersRepository();

  /**
   * GET /api/v2/users/me — Silent Migration Entry Point
   *
   * This is the ONLY place that triggers profile resolution.
   * On every authenticated request:
   *   - Existing users: fast DB lookup, no writes
   *   - New / unmigrated users: atomic profile seed, audit log written
   *
   * The `claims` object carries email + phone from the verified Supabase JWT.
   * They are used ONLY for seeding — never for authorization.
   */
  async getMyProfile(userId: string, claims: { email?: string; phone?: string } = {}) {
    if (!userId) throw new Error('User ID required');

    const { profile, migrated } = await this.repository.resolveOrSeedProfile(userId, claims);

    if (profile.is_frozen) throw new Error('Account suspended.');

    return { profile, migrated };
  }

  /**
   * PATCH /api/v2/users/me — Update basic profile fields.
   */
  async updateProfile(userId: string, updates: { full_name?: string }) {
    if (!userId) throw new Error('User ID required');
    return this.repository.updateProfile(userId, updates);
  }
}

