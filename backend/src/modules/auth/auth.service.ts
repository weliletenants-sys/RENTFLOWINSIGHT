import { AuthRepository } from './auth.repository';
// Using bcrypt internally for stable cross-platform native Node.js hashing
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_key_only';
const JWT_EXPIRES_IN = '24h'; // Configurable duration

export class AuthService {
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
        email: `${user.phone}@welile.local`, // Fallback for interfaces expecting email
        firstName: defaultFirstName,
        lastName: defaultLastName,
        role: user.role,
        isVerified: user.verified || false
      }
    };
  }

  /**
   * Processes the Login payload, extracts hashes native side, verifies them securely,
   * and dispatches a robust JWT containing the Role mapping.
   */
  async loginDevice(phone: string, rawPasswordString: string) {
    if (!phone || !rawPasswordString) {
      throw new Error('Phone and Password are strictly required');
    }

    // NORMALIZE FRONTEND PAYLOAD
    // The Lovable explicitly attaches '+254' or '+256'. 
    // We parse the exact trailing 9 digits and prefix a standard 0 to match AWS RDS formatting.
    const normalizedPhone = phone.replace(/[^0-9]/g, '').length >= 9 
      ? '0' + phone.replace(/[^0-9]/g, '').slice(-9)
      : phone;

    let user = await this.repository.findProfileByPhone(normalizedPhone);
    
    // Fallback: If normalized failed, try strict frontend variant in case of absolute uniqueness
    if (!user) {
       user = await this.repository.findProfileByPhone(phone);
    }

    if (!user || !user.password_hash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(rawPasswordString, user.password_hash);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (user.is_frozen) {
      throw new Error('This account has been frozen.');
    }

    // Embed Role deeply inside the token payload
    const tokenPayload = {
      sub: user.id,   // standard JWT subject flag
      id: user.id,    // backward capability
      role: user.role || 'USER',
      phone: user.phone
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return this.generateUserResponse(user, token);
  }

  /**
   * Hashes plain text securely and passes parameters explicitly into the Repository insertion block.
   */
  async registerNative(phone: string, fullName: string, rawPasswordString: string, role: string = 'TENANT') {
    if (!phone || !fullName || !rawPasswordString) {
      throw new Error('Phone, Full Name, and Password are strictly required');
    }

    const existingRef = await this.repository.findProfileByPhone(phone);
    if (existingRef) {
      throw new Error('Conflict: A profile with that number already exists.');
    }

    const hashed = await bcrypt.hash(rawPasswordString, 12);
    
    const newUser = await this.repository.createProfile({
      phone,
      full_name: fullName,
      password_hash: hashed,
      role
    });

    // Provide automatic login on registration
    const tokenPayload = {
      sub: newUser.id,
      id: newUser.id,
      role: newUser.role,
      phone: newUser.phone
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return this.generateUserResponse(newUser, token);
  }
}
