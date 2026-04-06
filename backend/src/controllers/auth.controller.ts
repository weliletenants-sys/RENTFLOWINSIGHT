import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../prisma/prisma.client';
import { logSecurityEvent } from '../utils/logger';
import { OTPService } from '../services/otp.service';
import { problemResponse } from '../utils/problem';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Standard RFC 7807 Error Response wrapper matching api.md

// Helper to reliably find a phone number format despite variations
const getPhoneVariants = (rawPhone: string): string[] => {
  const cleanPhone = rawPhone.trim();
  let phoneVariants = [cleanPhone];
  if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
    phoneVariants.push(`256${cleanPhone.slice(1)}`);
    phoneVariants.push(`+256${cleanPhone.slice(1)}`);
  } else if (cleanPhone.startsWith('256') && cleanPhone.length === 12) {
    phoneVariants.push(`0${cleanPhone.slice(3)}`);
    phoneVariants.push(`+${cleanPhone}`);
  } else if (cleanPhone.startsWith('+256') && cleanPhone.length === 13) {
    phoneVariants.push(`0${cleanPhone.slice(4)}`);
    phoneVariants.push(`${cleanPhone.slice(1)}`);
  }
  return phoneVariants;
};
export const register = async (req: Request, res: Response) => {
  try {
    const { phone, password, firstName, lastName, role, email, referrer_id } = req.body;

    // 1. Strict Input Validation (backend.md)
    if (!phone || phone.trim().length === 0) {
      return problemResponse(res, 400, 'Validation Error', 'A valid phone number is required', 'missing-phone');
    }
    if (!password || password.length < 8) {
      return problemResponse(res, 400, 'Validation Error', 'Password must be at least 8 characters long', 'weak-password');
    }
    if (!firstName || !lastName || !role) {
      return problemResponse(res, 400, 'Validation Error', 'First name, last name, and role are required', 'missing-fields');
    }

    const phoneTrimmed = phone.trim();
    const existingPhoneUser = await prisma.profiles.findFirst({ where: { phone: phoneTrimmed } });
    if (existingPhoneUser) {
      return problemResponse(res, 409, 'Conflict', 'Account with this phone number already exists', 'phone-exists');
    }

    // Must have successfully verified OTP in the last hour
    const isVerified = await prisma.otpVerifications.findFirst({
      where: {
        phone: phoneTrimmed,
        verified: true,
        updated_at: { gte: new Date(Date.now() - 60 * 60 * 1000).toISOString() }
      }
    });

    if (!isVerified) {
      return problemResponse(res, 403, 'Forbidden', 'Phone number must be verified via OTP before registration.', 'unverified-phone');
    }

    const emailTrimmed = email && email.trim().length > 0 ? email.toLowerCase().trim() : null;
    if (emailTrimmed) {
      const existingEmailUser = await prisma.profiles.findFirst({ where: { email: emailTrimmed } });
      if (existingEmailUser) {
        return problemResponse(res, 409, 'Conflict', 'Account with this email already exists', 'email-exists');
      }
    }

    const now = new Date().toISOString();
    const password_hash = await bcrypt.hash(password, 12); // secure hashing

    // 2. Atomic DB Transaction (backend.md)
    const result = await prisma.$transaction(async (tx) => {
      const profile = await tx.profiles.create({
        data: {
          email: emailTrimmed,
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          phone: phoneTrimmed,
          password_hash,
          role: role.toUpperCase(),
          referrer_id: referrer_id ? String(referrer_id).trim() : null,
          is_frozen: false,
          verified: false,
          rent_discount_active: false,
          created_at: now,
          updated_at: now,
        },
      });

      await tx.userRoles.create({
        data: {
          user_id: profile.id,
          role: role.toUpperCase(),
          enabled: true,
          created_at: now
        }
      });

      const wallet = await tx.wallets.create({
        data: {
          balance: 0.00,
          user_id: profile.id,
          created_at: now,
          updated_at: now
        }
      });

      const bucketTypes = ['available', 'invested', 'commission', 'reserved', 'savings'];
      for (const bucket of bucketTypes) {
        await tx.walletBuckets.create({
          data: {
            wallet_id: wallet.id,
            bucket_type: bucket,
            balance: 0.00,
          }
        });
      }

      return profile;
    });

    // 3. Dual-layered structured security logs (backend.md)
    await logSecurityEvent({
      event: 'REGISTER_SUCCESS',
      user_id: result.id,
      email: result.email || undefined,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    // Alert the COO Dashboard by adding a system event
    await prisma.systemEvents.create({
      data: {
        event_type: 'USER_REGISTRATION',
        related_entity_type: 'PROFILE',
        related_entity_id: result.id,
        created_at: now
      }
    });

    const payload = { phone: result.phone, email: result.email, sub: result.id, role: role, firstName: firstName.trim() };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Retain previous active sessions for multi-device support
    await prisma.sessions.create({
      data: {
        user_id: result.id,
        token: access_token,
        device_info: req.headers['user-agent']?.substring(0, 255) || null,
        ip_address: req.ip?.substring(0, 45) || null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    let onboarding_url = '/dashboard';
    if (role === 'AGENT') onboarding_url = '/agent-onboarding';
    if (role === 'TENANT') onboarding_url = '/tenant-agreement';
    if (role === 'FUNDER') onboarding_url = '/funder';
    if (role === 'SUPER_ADMIN') onboarding_url = '/admin';

    // 4. Standardized Success Output {status, data, message} (backend.md)
    return res.status(201).json({
      status: 'success',
      message: 'Account registered successfully',
      data: {
        access_token,
        onboarding_url,
        user: { id: result.id, email: result.email, firstName, lastName, role, isVerified: result.verified, phone: result.phone }
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    await logSecurityEvent({ event: 'REGISTER_FAILED', ip_address: req.ip, user_agent: req.headers['user-agent'], details: { error: error.message } });
    return problemResponse(res, 500, 'Internal Server Error', 'An unexpected error occurred during registration', 'internal-error');
  }
};

import { AdminAuthService } from '../services/adminAuth.service';
import { UserAuthService } from '../services/userAuth.service';

export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return problemResponse(res, 400, 'Validation Error', 'Phone and password are required', 'missing-credentials');
    
    // The request must explicitly come strictly from the admin context middleware flow
    if (req.context !== 'admin') {
      return problemResponse(res, 403, 'Forbidden', 'Strict isolation violation', 'domain-violation');
    }

    const { token, onboarding_url, user } = await AdminAuthService.login(phone, password, req.ip || '', req.headers['user-agent'] || '');
    
    // Strict HTTP-Only Admin Session Cookie mapping back to admin.localhost natively
    res.cookie('admin_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.ADMIN_SESSION_DOMAIN || 'admin.localhost',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    return res.status(200).json({ status: 'success', message: 'Admin authenticated tightly securely.', data: { onboarding_url, user } });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') return problemResponse(res, 401, 'Unauthorized', 'Invalid credentials', 'invalid-credentials');
    if (error.message === 'Unauthorized for admin domain') return problemResponse(res, 403, 'Forbidden', error.message, 'unauthorized');
    return problemResponse(res, 500, 'Internal Server Error', 'Unexpected login failure', 'internal-error');
  }
};

export const userLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return problemResponse(res, 400, 'Validation Error', 'Phone and password are required', 'missing-credentials');
    
    if (req.context === 'admin') {
      return problemResponse(res, 403, 'Forbidden', 'Admin domain must use admin auth', 'domain-violation');
    }

    const { token, onboarding_url, user } = await UserAuthService.login(phone, password, req.ip || '', req.headers['user-agent'] || '');
    
    // Strict HTTP-Only User Session Cookie mapping natively to the app domain
    res.cookie('user_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.SESSION_DOMAIN || 'localhost',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.status(200).json({ status: 'success', message: 'Logged in successfully', data: { onboarding_url, user } });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') return problemResponse(res, 401, 'Unauthorized', 'Invalid phone number or password', 'invalid-credentials');
    if (error.message === 'Administrator accounts must log in through the secure admin portal.') return problemResponse(res, 403, 'Forbidden', error.message, 'unauthorized');
    return problemResponse(res, 500, 'Internal Server Error', 'Unexpected login failure', 'internal-error');
  }
};

export const ssoLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return problemResponse(res, 400, 'Bad Request', 'Google credential missing', 'missing-credential');
    }

    // Hit Google's secure UserInfo endpoint using the raw access token
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credential}` }
    });

    if (!googleRes.ok) {
      return problemResponse(res, 400, 'Bad Request', 'Invalid Google token structure', 'invalid-credential');
    }

    const payload = await googleRes.json();
    if (!payload || !payload.email) {
      return problemResponse(res, 400, 'Bad Request', 'Invalid Google payload mapping', 'invalid-credential');
    }

    const email = payload.email.toLowerCase();

    // The rigorous check mandated by the user constraint
    const profile = await prisma.profiles.findFirst({ where: { email } });

    if (!profile) {
      return res.status(404).json({
        detail: "Account doesn't exist, try again.",
        message: "Account doesn't exist, try again."
      });
    }

    const userRoleRecord = await prisma.userRoles.findFirst({ where: { user_id: profile.id, enabled: true }, orderBy: { created_at: 'desc' } }) || await prisma.userRoles.findFirst({ where: { user_id: profile.id }, orderBy: { created_at: 'desc' } });
    const role = userRoleRecord ? userRoleRecord.role.toUpperCase() : (profile.role ? profile.role.toUpperCase() : 'TENANT');

    // We reached here? The email exists. We grant access.
    const jwtPayload = { email: profile.email, sub: profile.id, role };
    const access_token = jwt.sign(jwtPayload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    // Business Logic constraint: Single Device Policy execution
    // Retain previous active sessions for multi-device cross-browser tracking
    await prisma.sessions.create({
      data: {
        user_id: profile.id,
        token: access_token,
        device_info: req.headers['user-agent']?.substring(0, 255) || null,
        ip_address: req.ip?.substring(0, 45) || null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    await logSecurityEvent({ event: 'SSO_LOGIN_SUCCESS', user_id: profile.id, email: profile.email || undefined, ip_address: req.ip, user_agent: req.headers['user-agent'] });

    let onboarding_url = '/dashboard';
    if (role === 'AGENT' && profile.verified === false) onboarding_url = '/agent-onboarding';
    else if (role === 'AGENT') onboarding_url = '/dashboard';
    if (role === 'TENANT') onboarding_url = '/tenant-agreement';
    if (role === 'FUNDER') onboarding_url = '/funder';
    if (role === 'SUPER_ADMIN') onboarding_url = '/admin';

    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        access_token,
        onboarding_url,
        user: {
          id: profile.id,
          email: profile.email,
          firstName: profile.full_name?.split(' ')[0] || 'User',
          lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
          role,
          isVerified: profile.verified,
          phone: profile.phone
        }
      }
    });

  } catch (err: any) {
    console.error('SSO Login Error:', err);
    return problemResponse(res, 500, 'Internal Server Error', 'SSO Login failed', 'sso-error');
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return problemResponse(res, 400, 'Validation Error', 'Phone is required', 'missing-phone');

    const otp_code = OTPService.generateCode(4);
    const message = `Your RentFlowInsight verification code is ${otp_code}. It expires in 10 minutes.`;

    // Dispatch SMS asynchronously
    const smsSent = await OTPService.sendSMS(phone, message);
    if (!smsSent) {
      console.warn("Africa's Talking SMS dispatch failed. The code may not have been delivered.");
      // Proceed gracefully for development/testing environments despite SMS failure.
    }
    const now = new Date();
    const expires_at = new Date(now.getTime() + 10 * 60000).toISOString();

    await prisma.otpVerifications.create({
      data: { phone, otp_code, attempts: 0, verified: false, created_at: now.toISOString(), updated_at: now.toISOString(), expires_at }
    });

    return res.status(200).json({ status: 'success', message: 'OTP sent successfully', data: {} });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Could not send OTP', 'internal-error');
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp_code } = req.body;
    if (!phone || !otp_code) return problemResponse(res, 400, 'Validation Error', 'Phone and OTP are required', 'missing-otp');

    const verification = await prisma.otpVerifications.findFirst({
      where: { phone, otp_code, verified: false },
      orderBy: { created_at: 'desc' },
    });

    if (!verification) return problemResponse(res, 400, 'Bad Request', 'Invalid or expired OTP', 'invalid-otp');
    if (new Date(verification.expires_at) < new Date()) return problemResponse(res, 400, 'Bad Request', 'OTP has expired', 'expired-otp');

    await prisma.otpVerifications.update({
      where: { id: verification.id },
      data: { verified: true, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    });

    return res.status(200).json({ status: 'success', message: 'OTP verified successfully', data: {} });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Could not verify OTP', 'internal-error');
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        await prisma.sessions.update({
          where: { token },
          data: { is_revoked: true }
        });
      } catch (e) {
        // Token might not exist if already revoked, ignore safely
      }
    }

    if (user && user.sub) {
      await logSecurityEvent({
        event: 'LOGOUT_SUCCESS',
        user_id: user.sub,
        email: user.email,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
      data: {}
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'An unexpected error occurred during logout', 'internal-error');
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

/**
 * Step 1: User submits their phone number → send OTP via Africa's Talking SMS
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return problemResponse(res, 400, 'Validation Error', 'Phone number is required', 'missing-phone');

    const cleanPhone = phone.trim();
    const phoneVariants = getPhoneVariants(cleanPhone);

    // Confirm the phone belongs to a known account
    const profile = await prisma.profiles.findFirst({ 
      where: { phone: { in: phoneVariants } } 
    });
    if (!profile) {
      // Return the same response to avoid account enumeration
      return res.status(200).json({ status: 'success', message: 'If this number is registered, an OTP has been sent.', data: {} });
    }

    // Standardize the phone number format for the SMS sending service
    const targetPhone = profile.phone;

    const otp_code = OTPService.generateCode(6);
    const message = `Your RentFlowInsight password reset code is ${otp_code}. It expires in 10 minutes. Do not share it.`;

    await OTPService.sendSMS(phone.trim(), message);

    const now = new Date();
    const expires_at = new Date(now.getTime() + 10 * 60000).toISOString();

    await prisma.otpVerifications.create({
      data: {
        phone: phone.trim(),
        otp_code,
        attempts: 0,
        verified: false,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        expires_at,
      },
    });

    return res.status(200).json({ status: 'success', message: 'Password reset OTP sent via SMS.', data: {} });
  } catch (error) {
    console.error('Forgot password error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not initiate password reset', 'internal-error');
  }
};

/**
 * Step 2: User submits OTP → verify it and issue a short-lived reset token
 */
export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const { phone, otp_code } = req.body;
    if (!phone || !otp_code) return problemResponse(res, 400, 'Validation Error', 'Phone and OTP are required', 'missing-fields');

    const verification = await prisma.otpVerifications.findFirst({
      where: { phone: phone.trim(), otp_code: String(otp_code), verified: false },
      orderBy: { created_at: 'desc' },
    });

    if (!verification) return problemResponse(res, 400, 'Bad Request', 'Invalid or expired reset code', 'invalid-otp');
    if (new Date(verification.expires_at) < new Date()) return problemResponse(res, 400, 'Bad Request', 'Reset code has expired', 'expired-otp');

    await prisma.otpVerifications.update({
      where: { id: verification.id },
      data: { verified: true, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    });

    // Issue a short-lived (15 min) reset token tied to the phone
    const resetToken = jwt.sign({ phone: phone.trim(), purpose: 'password-reset' }, JWT_SECRET, { expiresIn: '15m' });

    return res.status(200).json({ status: 'success', message: 'Code verified.', data: { reset_token: resetToken } });
  } catch (error) {
    console.error('Verify reset code error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not verify reset code', 'internal-error');
  }
};

/**
 * Step 3: User submits new password with the reset token
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { reset_token, new_password } = req.body;
    if (!reset_token || !new_password) return problemResponse(res, 400, 'Validation Error', 'Reset token and new password are required', 'missing-fields');
    if (new_password.length < 8) return problemResponse(res, 400, 'Validation Error', 'Password must be at least 8 characters', 'weak-password');

    let payload: any;
    try {
      payload = jwt.verify(reset_token, JWT_SECRET);
    } catch {
      return problemResponse(res, 401, 'Unauthorized', 'Reset token is invalid or has expired', 'invalid-token');
    }

    if (payload.purpose !== 'password-reset') {
      return problemResponse(res, 401, 'Unauthorized', 'Invalid reset token purpose', 'invalid-token');
    }

    const phoneVariants = getPhoneVariants(payload.phone);
    const profile = await prisma.profiles.findFirst({ where: { phone: { in: phoneVariants } } });
    if (!profile) return problemResponse(res, 404, 'Not Found', 'Account not found', 'not-found');

    const password_hash = await bcrypt.hash(new_password, 12);
    await prisma.profiles.update({
      where: { id: profile.id },
      data: { password_hash, updated_at: new Date().toISOString() },
    });

    return res.status(200).json({ status: 'success', message: 'Password reset successfully. You can now log in.', data: {} });
  } catch (error) {
    console.error('Reset password error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not reset password', 'internal-error');
  }
};

