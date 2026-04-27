import prisma from '../../prisma/prisma.client';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  /**
   * Retrieves a User strictly by their unique Phone Number.
   * This forms the backbone of the native credential validation.
   */
  async findProfileByPhone(phone: string) {
    return prisma.profiles.findUnique({
      where: { phone }
    });
  }

  /**
   * Retrieves a User by their internal Platform ID.
   */
  async findProfileById(id: string) {
    return prisma.profiles.findUnique({
      where: { id }
    });
  }

  /**
   * Provisions a brand new profile for Native signups.
   */
  async createProfile(data: {
    phone: string;
    full_name: string;
    password_hash: string;
    role: string;
    national_id?: string;
    referrer_id?: string;
  }) {
    const now = new Date().toISOString();
    
    return prisma.$transaction(async (tx) => {
      // 1. Create Profile
      const profile = await tx.profiles.create({
        data: {
          phone: data.phone,
          full_name: data.full_name,
          password_hash: data.password_hash,
          role: data.role,
          national_id: data.national_id,
          referrer_id: data.referrer_id,
          is_frozen: false,
          verified: false,
          created_at: now,
          updated_at: now,
        }
      });

      // 2. Assign Default Role matching frontend expectations
      await tx.userRoles.create({
        data: {
          user_id: profile.id,
          role: data.role.toLowerCase(),
          enabled: true
        }
      });

      // 3. Create initial Wallet explicitly since we bypassed Supabase triggers
      await tx.wallets.create({
        data: {
          account_id: profile.id,
          user_id: profile.id,
          balance: 0,
          locked_balance: 0,
          currency: 'UGX'
        }
      });

      // 4. Create Referral mapping if referrerId exists
      if (data.referrer_id) {
        await tx.referrals.create({
          data: {
            referrer_id: data.referrer_id,
            referred_id: profile.id,
            bonus_amount: 0, // Placeholder, evaluated by async ledger jobs later
            credited: false
          }
        });
      }

      return profile;
    });
  }

  /**
   * Finds the latest unverified, unexpired OTP for a list of possible phone variants.
   */
  async findValidOtp(phoneVariants: string[], otpCode: string) {
    const now = new Date();
    return prisma.otpVerifications.findFirst({
      where: {
        phone: { in: phoneVariants },
        otp_code: otpCode,
        verified: false,
        expires_at: { gt: now }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  /**
   * Checks if there's an expired OTP matching the code to return a better error.
   */
  async findExpiredOtp(phoneVariants: string[], otpCode: string) {
    const now = new Date();
    return prisma.otpVerifications.findFirst({
      where: {
        phone: { in: phoneVariants },
        otp_code: otpCode,
        verified: false,
        expires_at: { lte: now }
      }
    });
  }

  /**
   * Increments the attempts counter on an OTP record.
   */
  async incrementOtpAttempts(id: string, currentAttempts: number) {
    return prisma.otpVerifications.update({
      where: { id },
      data: { attempts: currentAttempts + 1 }
    });
  }

  /**
   * Marks an OTP as successfully verified.
   */
  async markOtpVerified(id: string) {
    return prisma.otpVerifications.update({
      where: { id },
      data: { 
        verified: true, 
        verified_at: new Date()
      }
    });
  }

  /**
   * Creates a new OTP verification record.
   */
  async createOtpVerification(phone: string, otpCode: string, expiresAt: Date) {
    return prisma.otpVerifications.create({
      data: {
        phone,
        otp_code: otpCode,
        expires_at: expiresAt,
        verified: false,
        attempts: 0
      }
    });
  }

  /**
   * Updates last_active_at for a profile
   */
  async updateLastActive(id: string) {
    return prisma.profiles.update({
      where: { id },
      data: {
        last_active_at: new Date().toISOString()
      }
    });
  }

  /**
   * Updates the password hash for a user profile
   */
  async updatePassword(id: string, passwordHash: string) {
    return prisma.profiles.update({
      where: { id },
      data: { password_hash: passwordHash }
    });
  }

  /**
   * Deletes a user profile completely
   */
  async deleteUser(id: string) {
    return prisma.profiles.delete({
      where: { id }
    });
  }
}
