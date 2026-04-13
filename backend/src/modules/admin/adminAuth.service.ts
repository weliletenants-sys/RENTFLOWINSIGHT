import { AuthRepository } from '../auth/auth.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_key_only';
const JWT_EXPIRES_IN = '12h'; // Shorter expiration for admin

const ADMIN_ROLES = ['ADMIN', 'SUPERADMIN', 'CFO', 'COO', 'EXECUTIVE'];

export class AdminAuthService {
  private repository = new AuthRepository();

  private generateUserResponse(user: any, token: string) {
    const defaultFirstName = user.full_name ? user.full_name.split(' ')[0] : 'User';
    const defaultLastName = user.full_name && user.full_name.includes(' ') 
      ? user.full_name.substring(user.full_name.indexOf(' ') + 1) 
      : '';

    return {
      access_token: token,
      user: {
        id: user.id,
        phone: user.phone,
        email: `${user.phone}@welile.local`,
        firstName: defaultFirstName,
        lastName: defaultLastName,
        role: user.role,
        isVerified: user.verified || false
      }
    };
  }

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

    return this.generateUserResponse(user, token);
  }
}
