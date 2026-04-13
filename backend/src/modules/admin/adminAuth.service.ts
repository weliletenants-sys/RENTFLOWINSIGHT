import { AuthRepository } from '../auth/auth.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_key_only';
const JWT_EXPIRES_IN = '12h'; // Shorter expiration for admin

const ADMIN_ROLES = ['ADMIN', 'SUPERADMIN', 'CFO', 'COO', 'EXECUTIVE'];

export class AdminAuthService {
  private repository = new AuthRepository();

  /**
   * Processes the Login payload for administrative users strictly.
   */
  async loginAdminContext(phone: string, rawPasswordString: string) {
    if (!phone || !rawPasswordString) {
      throw new Error('Phone and Password are strictly required');
    }

    const user = await this.repository.findProfileByPhone(phone);

    if (!user || !user.password_hash) {
      throw new Error('Invalid credentials');
    }

    if (!user.role || !ADMIN_ROLES.includes(user.role)) {
      throw new Error('Unauthorized: Admin access is strictly requested but profile lacks necessary role assignments.');
    }

    const isValid = await bcrypt.compare(rawPasswordString, user.password_hash);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (user.is_frozen) {
      throw new Error('This administrative account has been frozen.');
    }

    const tokenPayload = {
      sub: user.id,
      id: user.id,
      role: user.role,
      phone: user.phone,
      domain: 'admin' // Explicitly tag as admin domain
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      token,
      profile: {
        id: user.id,
        phone: user.phone,
        fullName: user.full_name,
        role: user.role
      }
    };
  }
}
