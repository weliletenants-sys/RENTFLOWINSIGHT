import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma/prisma.client';
import { logSecurityEvent } from '../utils/logger';
import { sendTwoFactorOtp } from '../services/sms.service';

/**
 * Helper to conform to strict RFC 7807 application/problem+json formats.
 */
const problemResponse = (res: Response, status: number, title: string, detail: string, typeSuffix: string) => {
  return res.status(status).type('application/problem+json').json({
    type: `urn:welile:rentflow:error:${typeSuffix}`,
    title,
    status,
    detail
  });
};

/**
 * PUT /api/auth/security/password
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return problemResponse(res, 400, 'Validation Error', 'currentPassword and newPassword are required.', 'missing-fields');
    }

    if (newPassword.length < 8) {
      return problemResponse(res, 422, 'Weak Password', 'The new password must be at least 8 characters long.', 'validation-error');
    }

    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile || !profile.password_hash) {
      return problemResponse(res, 401, 'Unauthorized', 'Profile not found or no password configured.', 'invalid-credentials');
    }

    // Verify current password
    const isCurrentValid = await bcrypt.compare(currentPassword, profile.password_hash);
    if (!isCurrentValid) {
      await logSecurityEvent({
        event: 'PASSWORD_CHANGE_FAILED',
        user_id: userId,
        email: profile.email,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        details: { reason: 'wrong_current_password' }
      });
      return problemResponse(res, 401, 'Unauthorized', 'The current password provided is incorrect.', 'invalid-credentials');
    }

    // Hash the new password and update
    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.profiles.update({
      where: { id: userId },
      data: { password_hash: newHash, updated_at: new Date().toISOString() }
    });

    await logSecurityEvent({
      event: 'PASSWORD_CHANGED',
      user_id: userId,
      email: profile.email,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    // Revoke all existing sessions to force a clean re-login (optional security measure, uncomment if required natively)
    // await prisma.sessions.updateMany({ where: { user_id: userId, is_revoked: false }, data: { is_revoked: true } });

    return res.status(200).json({ status: 'success', message: 'Password changed successfully.' });
  } catch (error) {
    console.error('changePassword error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'An unexpected error occurred during password exchange.', 'internal-error');
  }
};

/**
 * POST /api/auth/security/2fa/enable
 */
export const enable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const profile = await prisma.profiles.findUnique({ where: { id: userId } });

    if (!profile || !profile.phone) {
      return problemResponse(res, 400, 'Phone Required', 'A valid phone number must be configured on your profile before enabling 2FA.', 'validation-error');
    }

    // Generate a secure 6-digit purely numerical string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now

    // Cache the OTP natively on the profile to avoid heavy Redis caching for this MVP
    // @ts-ignore - DB Schema is newer than generated Prisma Types due to Windows file lock skip-generate
    await prisma.profiles.update({
      where: { id: userId },
      data: {
        two_factor_otp: otp,
        two_factor_expires_at: expiryDate,
      } as any
    });

    // Fire the OTP to the native Africa's Talking SMS API Handler
    await sendTwoFactorOtp((profile as any).phone || profile.email, otp);

    await logSecurityEvent({
      event: '2FA_OTP_REQUESTED',
      user_id: profile.id,
      email: profile.email,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    return res.status(200).json({ status: 'success', message: `Verification code sent to ${profile.phone}.` });
  } catch (error: any) {
    console.error('enable2FA error:', error);
    return problemResponse(res, 500, 'Gateway Error', "We couldn't reach your mobile carrier. Please try again later.", 'network-error');
  }
};

/**
 * POST /api/auth/security/2fa/verify
 */
export const verify2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { otp } = req.body;

    if (!otp || typeof otp !== 'string' || otp.trim() === '') {
      return problemResponse(res, 400, 'Validation Error', 'Please provide the 6-digit code.', 'missing-fields');
    }

    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) {
      return problemResponse(res, 401, 'Unauthorized', 'Profile mismatch.', 'invalid-credentials');
    }

    if (!(profile as any).two_factor_otp || !(profile as any).two_factor_expires_at) {
      return problemResponse(res, 422, 'Session Expired', 'Your verification session has expired. Please request a new code.', 'validation-error');
    }

    const now = new Date();
    const expiresAt = new Date((profile as any).two_factor_expires_at);

    if (now > expiresAt) {
      return problemResponse(res, 422, 'Code Expired', 'Your OTP has expired. Please request a new one.', 'validation-error');
    }

    if ((profile as any).two_factor_otp !== otp.trim()) {
      await logSecurityEvent({
        event: '2FA_VERIFY_FAILED',
        user_id: profile.id,
        email: profile.email,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
      return problemResponse(res, 401, 'Unauthorized', 'The code you entered is incorrect.', 'invalid-credentials');
    }

    // Success - bind the schema dynamically and wipe the temporary caches!
    // @ts-ignore - DB Schema is newer than generated Prisma Types
    await prisma.profiles.update({
      where: { id: userId },
      data: {
        is_2fa_enabled: true,
        two_factor_otp: null,
        two_factor_expires_at: null,
        updated_at: new Date().toISOString()
      } as any
    });

    await logSecurityEvent({
      event: '2FA_ENABLED_SUCCESS',
      user_id: profile.id,
      email: profile.email,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    return res.status(200).json({ status: 'success', message: 'Two-Factor Authentication is now actively protecting your account.' });
  } catch (error) {
    console.error('verify2FA error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'An unexpected error occurred verifying your code.', 'internal-error');
  }
};
