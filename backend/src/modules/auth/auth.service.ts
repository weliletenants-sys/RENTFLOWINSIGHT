import { AuthRepository } from './auth.repository';
// Using bcrypt internally for stable cross-platform native Node.js hashing
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_key_only';
const JWT_EXPIRES_IN = '24h'; // Configurable duration

export class AuthService {
  private repository = new AuthRepository();

  /**
   * Processes the Login payload, extracts hashes native side, verifies them securely,
   * and dispatches a robust JWT containing the Role mapping.
   */
  async loginDevice(phone: string, rawPasswordString: string) {
    if (!phone || !rawPasswordString) {
      throw new Error('Phone and Password are strictly required');
    }

    const user = await this.repository.findProfileByPhone(phone);

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

    return newUser;
  }
}
