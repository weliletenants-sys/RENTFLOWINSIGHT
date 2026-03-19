import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../prisma/prisma.client';
import { logSecurityEvent } from '../utils/logger';
import { OTPService } from '../services/otp.service';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Standard RFC 7807 Error Response wrapper matching api.md
const problemResponse = (res: Response, status: number, title: string, detail: string, type: string) => {
  return res.status(status).contentType('application/problem+json').json({
    type: `https://api.welile.com/errors/${type}`,
    title,
    status,
    detail
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    // 1. Strict Input Validation (backend.md)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return problemResponse(res, 400, 'Validation Error', 'A valid email address is required', 'invalid-email');
    }
    if (!password || password.length < 8) {
      return problemResponse(res, 400, 'Validation Error', 'Password must be at least 8 characters long', 'weak-password');
    }
    if (!firstName || !lastName || !role) {
      return problemResponse(res, 400, 'Validation Error', 'First name, last name, and role are required', 'missing-fields');
    }

    const emailTrimmed = email.toLowerCase().trim();
    const existingUser = await prisma.profiles.findFirst({ where: { email: emailTrimmed } });
    if (existingUser) {
      return problemResponse(res, 409, 'Conflict', 'Account with this email already exists', 'email-exists');
    }

    const now = new Date().toISOString();
    const password_hash = await bcrypt.hash(password, 12); // secure hashing
    
    // 2. Atomic DB Transaction (backend.md)
    const result = await prisma.$transaction(async (tx) => {
      const profile = await tx.profiles.create({
        data: {
          email: emailTrimmed,
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          phone: phone ? phone.trim() : '0000000000',
          password_hash,
          is_frozen: false,
          verified: false,
          rent_discount_active: false,
          created_at: now,
          updated_at: now,
        },
      });

      await tx.userRoles.create({
        data: {
          role: role,
          user_id: profile.id,
          enabled: true,
          created_at: now
        }
      });

      await tx.wallets.create({
        data: {
          balance: 0.00,
          user_id: profile.id,
          created_at: now,
          updated_at: now
        }
      });

      return profile;
    });

    // 3. Dual-layered structured security logs (backend.md)
    await logSecurityEvent({
      event: 'REGISTER_SUCCESS',
      user_id: result.id,
      email: result.email,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    const payload = { email: result.email, sub: result.id, role: role };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    let onboarding_url = '/dashboard';
    if (role === 'AGENT') onboarding_url = '/agent-onboarding';
    if (role === 'TENANT') onboarding_url = '/tenant-agreement';

    // 4. Standardized Success Output {status, data, message} (backend.md)
    return res.status(201).json({
      status: 'success',
      message: 'Account registered successfully',
      data: {
        access_token,
        onboarding_url,
        user: { id: result.id, email: result.email, firstName, lastName, role }
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    await logSecurityEvent({ event: 'REGISTER_FAILED', ip_address: req.ip, user_agent: req.headers['user-agent'], details: { error: error.message } });
    return problemResponse(res, 500, 'Internal Server Error', 'An unexpected error occurred during registration', 'internal-error');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return problemResponse(res, 400, 'Validation Error', 'Email and password are required', 'missing-credentials');
    }

    const emailTrimmed = email.toLowerCase().trim();
    const profile = await prisma.profiles.findFirst({ where: { email: emailTrimmed } });
    
    // Auth Validation
    if (!profile || !profile.password_hash) {
      // Intentional delay to avoid timing leaks
      await bcrypt.compare('dummy', '$2b$12$dummyhashstings12345678'); 
      await logSecurityEvent({ event: 'LOGIN_FAILED', email: emailTrimmed, ip_address: req.ip, user_agent: req.headers['user-agent'], details: { reason: 'user_not_found_or_no_password' }});
      return problemResponse(res, 401, 'Unauthorized', 'Invalid email or password', 'invalid-credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, profile.password_hash);
    if (!isPasswordValid) {
      await logSecurityEvent({ event: 'LOGIN_FAILED', user_id: profile.id, email: profile.email, ip_address: req.ip, user_agent: req.headers['user-agent'], details: { reason: 'wrong_password' }});
      return problemResponse(res, 401, 'Unauthorized', 'Invalid email or password', 'invalid-credentials');
    }
    
    const userRole = await prisma.userRoles.findFirst({ where: { user_id: profile.id, enabled: true }, orderBy: { created_at: 'desc' } });
    const role = userRole ? userRole.role : 'TENANT';

    const payload = { email: profile.email, sub: profile.id, role };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    await logSecurityEvent({ event: 'LOGIN_SUCCESS', user_id: profile.id, email: profile.email, ip_address: req.ip, user_agent: req.headers['user-agent'] });

    let onboarding_url = '/dashboard';
    if (role === 'AGENT' && profile.verified === false) onboarding_url = '/agent-onboarding';
    else if (role === 'AGENT') onboarding_url = '/dashboard';
    if (role === 'TENANT') onboarding_url = '/tenant-agreement'; // or based on tenant onboarding status

    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        access_token,
        onboarding_url,
        user: {
          id: profile.id,
          email: profile.email,
          firstName: profile.full_name.split(' ')[0],
          lastName: profile.full_name.split(' ').slice(1).join(' '),
          role,
        }
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    await logSecurityEvent({ event: 'LOGIN_ERROR', ip_address: req.ip, user_agent: req.headers['user-agent'], details: { error: error.message } });
    return problemResponse(res, 500, 'Internal Server Error', 'An unexpected error occurred during login', 'internal-error');
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
