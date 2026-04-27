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
  async registerNative(phone: string, fullName: string, rawPasswordString: string, role: string = 'TENANT', nationalId?: string, referrerId?: string) {
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
      role,
      national_id: nationalId,
      referrer_id: referrerId
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

  /**
   * Generates and sends a 6-digit OTP for login
   */
  async requestOtp(phone: string) {
    if (!phone) throw new Error('Phone number is required');

    // Clean phone
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) throw new Error('Invalid phone number');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    // Normalize phone to format with 0
    const normalizedPhone = '0' + digits.slice(-9);

    await this.repository.createOtpVerification(normalizedPhone, otpCode, expiresAt);

    // TODO: Integrate actual SMS provider here (Africa's Talking, Twilio, etc.)
    console.log(`[AuthService] Generated OTP for ${normalizedPhone}: ${otpCode}`);

    return { success: true, message: 'OTP sent successfully' };
  }

  /**
   * Verifies an OTP and logs the user in, returning a native JWT
   */
  async verifyOtpAndLogin(phone: string, otp: string) {
    if (!phone || !otp) throw new Error('Phone and OTP are required');

    const digits = phone.replace(/\D/g, "");
    const last9 = digits.slice(-9);
    const phoneVariants = [`0${last9}`, `256${last9}`, last9, `+256${last9}`];

    const otpRecord = await this.repository.findValidOtp(phoneVariants, otp);

    if (!otpRecord) {
      const expiredRecord = await this.repository.findExpiredOtp(phoneVariants, otp);
      if (expiredRecord) {
        throw new Error('Code expired. Please request a new one.');
      }
      throw new Error('Invalid code. Please check and try again.');
    }

    if (otpRecord.attempts >= 5) {
      throw new Error('Too many attempts. Please request a new code.');
    }

    await this.repository.incrementOtpAttempts(otpRecord.id, otpRecord.attempts);
    await this.repository.markOtpVerified(otpRecord.id);

    // Find the user profile using the variants
    let user = null;
    for (const variant of phoneVariants) {
      user = await this.repository.findProfileByPhone(variant);
      if (user) break;
    }

    if (!user) {
      throw new Error('No account found with this phone number. Please sign up first.');
    }

    if (user.is_frozen) {
      throw new Error('This account has been frozen.');
    }

    await this.repository.updateLastActive(user.id);

    const tokenPayload = {
      sub: user.id,
      id: user.id,
      role: user.role || 'USER',
      phone: user.phone
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      success: true,
      token, // The frontend apiClient expects 'token' or parses it
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.full_name
      }
    };
  }

  /**
   * Generates and sends a 6-digit OTP specifically for password reset
   */
  async requestPasswordResetOtp(phone: string) {
    if (!phone) throw new Error('Phone number is required');

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) throw new Error('Invalid phone number');

    const last9 = digits.slice(-9);
    const phoneVariants = [`0${last9}`, `256${last9}`, last9, `+256${last9}`];

    let user = null;
    for (const variant of phoneVariants) {
      user = await this.repository.findProfileByPhone(variant);
      if (user) break;
    }

    if (!user) {
      throw new Error('No account found with this phone number.');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60000); // 1 hour
    const resetKey = `reset_${last9}`;

    await this.repository.createOtpVerification(resetKey, otpCode, expiresAt);

    console.log(`[AuthService] Password Reset OTP for ***${last9.slice(-4)}: ${otpCode}`);

    return { success: true, message: 'Reset code sent' };
  }

  /**
   * Verifies reset OTP and updates the password
   */
  async resetPasswordWithOtp(phone: string, otp: string, newPassword: string) {
    if (!phone || !otp || !newPassword) {
      throw new Error('Phone, OTP, and new password are required');
    }
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const digits = phone.replace(/\D/g, "");
    const last9 = digits.slice(-9);
    const resetKey = `reset_${last9}`;

    const otpRecord = await this.repository.findValidOtp([resetKey], otp);

    if (!otpRecord) {
      throw new Error('No valid reset code found or code is incorrect.');
    }

    if (otpRecord.attempts >= 5) {
      throw new Error('Too many failed attempts. Please request a new code.');
    }

    await this.repository.incrementOtpAttempts(otpRecord.id, otpRecord.attempts);
    await this.repository.markOtpVerified(otpRecord.id);

    const phoneVariants = [`0${last9}`, `256${last9}`, last9, `+256${last9}`];
    let user = null;
    for (const variant of phoneVariants) {
      user = await this.repository.findProfileByPhone(variant);
      if (user) break;
    }

    if (!user) {
      throw new Error('User not found');
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await this.repository.updatePassword(user.id, hashed);

    return { success: true, message: 'Password reset successfully' };
  }

  /**
   * Admin direct password reset
   */
  async adminResetPassword(userId: string, newPassword: string) {
    if (!userId || !newPassword) throw new Error('userId and newPassword required');
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.repository.updatePassword(userId, hashed);
    return { success: true, message: 'Password reset successfully' };
  }

  /**
   * Admin delete user
   */
  async adminDeleteUser(userId: string) {
    if (!userId) throw new Error('userId required');
    await this.repository.deleteUser(userId);
    return { success: true, message: 'User deleted' };
  }
}
